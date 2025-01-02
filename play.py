# %%
prompts = []

themes = [
    "Beautiful", "Majestic", "Surreal", "Abstract", "Futuristic", "Epic",
    "Minimalistic", "Dreamlike", "Elegant", "Intricate"
]
subjects = [
    "landscape", "portrait", "cityscape", "wildlife", "architecture", 
    "scenery", "fantasy world", "mythical creature", "cyberpunk world",
    "galactic space"
]
descriptors = [
    "at sunrise", "under moonlight", "with vivid colors", "in a storm", 
    "during a festival", "in an apocalyptic setting", "in a utopian future", 
    "with neon lights", "in a dream", "with mystical fog"
]

# %%
import random

all_combinations = [
    f"{theme} {subject} {descriptor}"
    for theme in themes
    for subject in subjects
    for descriptor in descriptors
]
random.shuffle(all_combinations)

# Select the first 1000 prompts
prompts = all_combinations[:1000] 
prompt = prompts[0]

# %%
import os
import requests

u = os.getenv('PLAY_U', 'http://localhost:5173')
# Define constants
url = f"{u}/darts"

print("url: {}".format(url))

pkey=os.getenv("AI_PRIVATE_KEY","0xa618896c28db371a21f9d805c25e622425319d85684a1f9478568509a3f3f4a9")

auth_token = f"Bearer {pkey}"
headers = {
    "Authorization": auth_token,
    "Content-Type": "application/json"
}
print("headers: {}".format(headers))

payload = {
    "module": "isdxl",
    "version": "v1.5.0",
    "inputs": {
        "Prompt": prompt,
        "Device": "xpu",
        "cpu": "18",
        "ram":"30gb",
        "Seed": random.randint(1000000, 1000000000),
        "author": "4b64f953-1441-43fe-a1c7-ffd060516bd0"
    }
}

# Send the POST request
response = requests.post(url, headers=headers, json=payload, timeout=60*5)

# Print the response for each prompt
if response.status_code == 200:
    # print(f"Success for prompt '{prompt}':", response.json())
    data = response.json()

    print(data)
else:
    print(f"Failed for prompt '{prompt}':", response.status_code, response.text)



