from fastapi import Request
import time
import logging

logger = logging.getLogger(__name__)

async def add_middleware(app):
    """Add custom middleware to app"""
    
    @app.middleware("http")
    async def log_requests(request: Request, call_next):
        """Log all requests"""
        start_time = time.time()
        
        response = await call_next(request)
        
        process_time = time.time() - start_time
        logger.info(
            f"{request.method} {request.url.path} - "
            f"Status: {response.status_code} - "
            f"Time: {process_time:.3f}s"
        )
        
        response.headers["X-Process-Time"] = str(process_time)
        return response