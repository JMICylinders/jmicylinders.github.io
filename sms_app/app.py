from flask import Flask, render_template, request, jsonify
import requests

app = Flask(__name__)

API_URL = "http://bulksmsbd.net/api/smsapi"
API_KEY = "t6qElhvPR1nyZ8prIC0C"
SENDER_ID = "8809617625650"

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        number = request.form["number"]
        message = request.form["message"]

        payload = {
            "api_key": API_KEY,
            "senderid": SENDER_ID,
            "number": number,
            "message": message
        }

        response = requests.post(API_URL, data=payload)

        if response.status_code == 200:
            return render_template("index.html", status="Message sent successfully!")
        else:
            return render_template("index.html", status="Failed to send message. Try again!")

    return render_template("index.html", status=None)

# This is the endpoint for your backend API to receive SMS requests
@app.route("/send", methods=["POST"])
def send_sms():
    number = request.form["number"]
    message = request.form["message"]

    payload = {
        "api_key": API_KEY,
        "senderid": SENDER_ID,
        "number": number,
        "message": message
    }

    response = requests.post(API_URL, data=payload)

    if response.status_code == 200:
        return jsonify({"status": "Message sent successfully!"}), 200
    else:
        return jsonify({"status": "Failed to send message."}), 400

if __name__ == "__main__":
    app.run(debug=True)
