# ai/vision/image_processor.py
import cv2

def analyze_image(image_path):
    image = cv2.imread(image_path)
    # Process the image as required
    # Example: Resize the image
    processed_image = cv2.resize(image, (300, 300))
    return processed_image
