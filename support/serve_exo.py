# launch a local development server for exo, running at http://localhost:9001
# based on https://fpira.com/blog/2020/05/python-http-server-with-cors

from http.server import SimpleHTTPRequestHandler, HTTPServer
import os.path
import argparse

webroot = os.path.join(os.path.split(__file__)[0],"..")

class CORSRequestHandler(SimpleHTTPRequestHandler):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=webroot, **kwargs)

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', '*')
        self.send_header('Access-Control-Allow-Headers', '*')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        return super(CORSRequestHandler, self).end_headers()

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument("--host",default="localhost")
    parser.add_argument("--port",type=int, default=9001)
    args = parser.parse_args()
    server = HTTPServer((args.host,args.port),CORSRequestHandler)
    print("Serving exo files at http://%s:%d/versions/latest/index.html" % (args.host, args.port))
    server.serve_forever()