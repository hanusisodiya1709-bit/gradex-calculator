#!/usr/bin/env python3
"""
==============================================================
  GRADEX - Local Prototype Server
  Serves the modern web application on localhost with auto-open
==============================================================
"""

import http.server
import socketserver
import webbrowser
import os
import sys

PORT = 5000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def log_message(self, format, *args):
        # Clean logging
        sys.stderr.write(f"  [GRADEX Server] {args[0]} - {args[1]}\n")

def main():
    os.chdir(DIRECTORY)
    server_address = ("", PORT)

    # Find free port if 5000 is taken
    actual_port = PORT
    httpd = None
    for p in range(PORT, PORT + 20):
        try:
            httpd = socketserver.TCPServer(("", p), Handler)
            actual_port = p
            break
        except OSError:
            continue

    if not httpd:
        print("❌ Could not bind to any port between 5000 and 5020.")
        sys.exit(1)

    url = f"http://localhost:{actual_port}/index.html"
    print("\n" + "=" * 65)
    print("  🚀 GRADEX • Student Grade Calculator Prototype is LIVE!")
    print(f"  🌐 URL: {url}")
    print("  📂 Serving from:", DIRECTORY)
    print("  💡 Press Ctrl+C in this terminal to stop the server.")
    print("=" * 65 + "\n")

    # Automatically open browser
    try:
        webbrowser.open(url)
    except Exception:
        pass

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n  🛑 Server stopped gracefully.")
        httpd.server_close()

if __name__ == "__main__":
    main()
