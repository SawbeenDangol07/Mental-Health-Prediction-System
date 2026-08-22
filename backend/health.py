"""
=============================================================================
Health & Uptime Monitoring Module
=============================================================================
Separate router module for UptimeRobot monitoring and keep-alive checks.
Supports HEAD and GET HTTP methods, returning JSON system status.
=============================================================================
"""

import datetime
from fastapi import APIRouter
from fastapi.responses import JSONResponse

router = APIRouter(tags=["Health"])


@router.api_route("/health", methods=["GET", "HEAD"])
@router.api_route("/api/health", methods=["GET", "HEAD"])
async def health_check():
    """
    Health Check & UptimeRobot Monitoring Endpoint.
    
    Accepts HEAD and GET requests.
    Returns JSON response indicating system status to keep the backend server active.
    """
    content = {
        "status": "active",
        "service": "Mental Health Classification API",
        "message": "System is healthy and active",
        "timestamp": datetime.datetime.utcnow().isoformat() + "Z"
    }
    return JSONResponse(content=content, status_code=200)
