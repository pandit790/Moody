from flask import Blueprint, jsonify

base_bp = Blueprint("base", __name__)

@base_bp.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Moody Backend Running"})
