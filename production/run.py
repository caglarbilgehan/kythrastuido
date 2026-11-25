#!/usr/bin/env python3
"""
KythraStudio Production Runner Entrypoint (4-Stage Engine)
Starts Uvicorn server on 0.0.0.0:8001 and prints Local + LAN network URLs.
"""

import os
import socket
import uvicorn


def get_lan_ip():
    """Finds the primary LAN IP address for multi-device access."""
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(('10.255.255.255', 1))
        ip = s.getsockname()[0]
    except Exception:
        ip = '127.0.0.1'
    finally:
        s.close()
    return ip


def main():
    lan_ip = get_lan_ip()
    port = int(os.environ.get("PORT", "8001"))

    banner = f"""
    ╔═══════════════════════════════════════════════════════════════════════════════╗
    ║                  KYTHRASTUDIO PRODUCTION V1 (4-STAGE ENGINE)                  ║
    ║  01 Beat/Tempo · 02 Chord/Key/Structure · 03 6-Stem Demux · 04 Lyrics/Karaoke ║
    ╠═══════════════════════════════════════════════════════════════════════════════╣
    ║  Local API:       http://localhost:{port}                           ║
    ║  LAN / Mobile:    http://{lan_ip}:{port}                        ║
    ║  API Docs:        http://localhost:{port}/docs                      ║
    ╚════════════════════════════════════════════════════════════════════╝
    """
    print(banner)

    uvicorn.run(
        "backend.api.main:app",
        host="0.0.0.0",
        port=port,
        reload=False,
        log_level="info",
        access_log=True,
    )


if __name__ == "__main__":
    main()
