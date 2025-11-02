import requests

data = {
    "U1": 3.7, "U2": 3.7, "U3": 3.7, "U4": 3.7,
    "U5": 3.7, "U6": 3.7, "U7": 3.7, "U8": 3.7,
    "U9": 3.7, "U10": 3.7, "U11": 3.7, "U12": 3.7,
    "U13": 3.7, "U14": 3.7, "U15": 3.7, "U16": 3.7,
    "U17": 3.7, "U18": 3.7, "U19": 3.7, "U20": 3.7,
    "U21": 3.7
}

response = requests.post("http://10.0.0.43:5000/predict", json=data)
print(response.json())
