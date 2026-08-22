"""
=============================================================================
Health, Ping & Uptime Monitoring Module
=============================================================================
Router module for UptimeRobot monitoring, mobile app keep-alive, and health checks.
Supports HEAD, GET, and POST HTTP methods across all health and ping routes.
=============================================================================
"""

import datetime
from fastapi import APIRouter
from fastapi.responses import JSONResponse, PlainTextResponse

router = APIRouter(tags=["Health & Ping"])


@router.api_route("/health", methods=["GET", "HEAD", "POST"])
@router.api_route("/api/health", methods=["GET", "HEAD", "POST"])
async def health_check():
    """
    Health Check & UptimeRobot Monitoring Endpoint.
    
    Accepts GET, HEAD, and POST requests.
    Returns JSON response indicating system status.
    """
    content = {
        "status": "active",
        "service": "Mental Health Classification API",
        "message": "System is healthy and active",
        "timestamp": datetime.datetime.utcnow().isoformat() + "Z"
    }
    return JSONResponse(content=content, status_code=200)


@router.api_route("/ping", methods=["GET", "HEAD", "POST"], response_class=PlainTextResponse)
@router.api_route("/keep-alive", methods=["GET", "HEAD", "POST"], response_class=PlainTextResponse)
@router.api_route("/api/ping", methods=["GET", "HEAD", "POST"], response_class=PlainTextResponse)
async def keep_alive_ping():
    """
    Mobile App & Service Ping Endpoint.
    
    Accepts GET, HEAD, and POST requests.
    Returns plain text 'pong' for full backward compatibility with mobile app and pingers.
    """
    return "pong"
