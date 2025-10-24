from google.cloud import storage
from google.api_core.exceptions import NotFound
from django.conf import settings
import os
import uuid
from datetime import datetime
from google.cloud import storage
from google.api_core.exceptions import NotFound
from django.conf import settings

def init_gcp_client():
    """Initialize GCP Storage client using service account JSON file."""
    return storage.Client.from_service_account_json(settings.GCP_SERVICE_ACCOUNT_FILE)

def ensure_bucket_exists():
    """Ensure GCS bucket exists, create it if missing, and enable public read access."""
    client = init_gcp_client()
    bucket_name = settings.GCP_BUCKET_NAME

    try:
        bucket = client.get_bucket(bucket_name)
        print(f"Bucket '{bucket_name}' already exists")
    except NotFound:
        print(f"Bucket '{bucket_name}' not found. Creating...")
        try:
            bucket = client.bucket(bucket_name)
            # specify location explicitly; 'US' works globally
            bucket.location = getattr(settings, "GCP_BUCKET_LOCATION", "US")
            bucket = client.create_bucket(bucket)
            bucket.iam_configuration.uniform_bucket_level_access_enabled = True
            bucket.patch()
            print(f"Bucket '{bucket_name}' created successfully")
        except Exception as e:
            raise Exception(
                f"Failed to create bucket '{bucket_name}': {e}. "
                "Ensure your service account has 'roles/storage.admin' or 'roles/owner'."
            )
    except Exception as e:
        if "storage.buckets.get access" in str(e):
            raise Exception(
                f"Service account lacks access to bucket '{bucket_name}'. "
                "Grant it 'Storage Admin' in GCP IAM."
            )
        else:
            raise Exception(f"Error accessing bucket '{bucket_name}': {e}")

    # --- Public read access ---
    try:
        policy = bucket.get_iam_policy(requested_policy_version=3)

        # 'members' must be a list, not a set
        existing_binding = next(
            (b for b in policy.bindings if b["role"] == "roles/storage.objectViewer"), None
        )

        if existing_binding:
            if "allUsers" not in existing_binding["members"]:
                existing_binding["members"].append("allUsers")
        else:
            policy.bindings.append(
                {"role": "roles/storage.objectViewer", "members": ["allUsers"]}
            )

        bucket.set_iam_policy(policy)
        print(f"Public read access ensured for bucket '{bucket_name}'")

    except Exception as e:
        print(f"Warning: Could not set public access policy for '{bucket_name}': {e}")

    return bucket


def upload_file_to_gcp(file_path, destination_blob_name):
    """
    Upload a file to GCP bucket and return public URL
    
    Args:
        file_path: Local path to the file to upload
        destination_blob_name: Path in the bucket where file will be stored
    
    Returns:
        Public URL of the uploaded file
    """
    client = init_gcp_client()
    bucket = client.get_bucket(settings.GCP_BUCKET_NAME)
    
    blob = bucket.blob(destination_blob_name)
    blob.upload_from_filename(file_path)
    
    # Construct public URL (no blob.make_public needed)
    public_url = f"https://storage.googleapis.com/{settings.GCP_BUCKET_NAME}/{destination_blob_name}"
    return public_url

def upload_file_object_to_gcp(file_object, destination_blob_name):
    """
    Upload a file object (from Django request.FILES) to GCP bucket and return public URL
    
    Args:
        file_object: Django UploadedFile object
        destination_blob_name: Path in the bucket where file will be stored
    
    Returns:
        Public URL of the uploaded file
    """
    client = init_gcp_client()
    bucket = client.get_bucket(settings.GCP_BUCKET_NAME)
    
    blob = bucket.blob(destination_blob_name)
    
    # Upload directly from file object
    file_object.seek(0)  # Reset file pointer to beginning
    blob.upload_from_file(file_object)
    
    # Construct public URL
    public_url = f"https://storage.googleapis.com/{settings.GCP_BUCKET_NAME}/{destination_blob_name}"
    return public_url

def download_and_upload_to_gcp(source_url, destination_blob_name):
    """
    Download a file from URL and upload to GCP bucket
    
    Args:
        source_url: URL of the file to download
        destination_blob_name: Path in the bucket where file will be stored
    
    Returns:
        Public URL of the uploaded file
    """
    import requests
    
    # Download file
    response = requests.get(source_url, stream=True)
    response.raise_for_status()
    
    client = init_gcp_client()
    bucket = client.get_bucket(settings.GCP_BUCKET_NAME)
    
    blob = bucket.blob(destination_blob_name)
    
    # Upload from downloaded content
    blob.upload_from_string(response.content)
    
    # Construct public URL
    public_url = f"https://storage.googleapis.com/{settings.GCP_BUCKET_NAME}/{destination_blob_name}"
    return public_url

def generate_unique_blob_name(folder, filename):
    """
    Generate a unique blob name with timestamp and UUID
    
    Args:
        folder: Folder path in bucket (e.g., 'images', 'videos')
        filename: Original filename
    
    Returns:
        Unique blob name
    """
    timestamp = int(datetime.now().timestamp() * 1000)
    unique_id = str(uuid.uuid4())[:8]
    ext = os.path.splitext(filename)[1]
    return f"{folder}/{timestamp}_{unique_id}{ext}"
