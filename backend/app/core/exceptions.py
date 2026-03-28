class ClassificationError(Exception):
    """Raised when classification fails"""
    pass

class ImageValidationError(Exception):
    """Raised when image is invalid"""
    pass

class GroqAPIError(Exception):
    """Raised when Groq API call fails"""
    pass