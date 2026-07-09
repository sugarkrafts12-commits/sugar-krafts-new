import http.server
import socketserver
import json
import subprocess
import ssl

PORT = 8080
RESEND_API_KEY = "re_Z9bs5NVH_AuZLD9ugjwGwCZsaTxFU5jPX"

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/api/send-email':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            try:
                data = json.loads(post_data.decode('utf-8'))
                
                name     = data.get('name', '')
                email    = data.get('email', '')
                details  = data.get('details', '')
                address  = data.get('address', '')
                cart     = data.get('cart', None)
                delivery = data.get('delivery', '')
                
                if cart is not None:
                    # Cart Checkout Order email
                    cart_html = ""
                    total = 0.0
                    for item in cart:
                        title = item.get('title', 'Goody')
                        qty = item.get('quantity', 1)
                        price = item.get('price', 0.0)
                        category = item.get('category', 'item')
                        item_sub = price * qty
                        total += item_sub
                        cart_html += f"""
                        <tr style="border-bottom: 1px solid #e6ccb2;">
                            <td style="padding: 10px; font-size: 15px; color: #181212;">
                                <strong>{title}</strong><br>
                                <span style="font-size: 12px; color: #7f5539; text-transform: uppercase;">{category}</span>
                            </td>
                            <td style="padding: 10px; font-size: 15px; text-align: center; color: #181212;">{qty}</td>
                            <td style="padding: 10px; font-size: 15px; text-align: right; color: #181212;">${price:.2f}</td>
                            <td style="padding: 10px; font-size: 15px; text-align: right; font-weight: bold; color: #181212;">${item_sub:.2f}</td>
                        </tr>
                        """
                    
                    email_html = f"""
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e3d5ca; border-radius: 12px; background-color: #f5ebe0;">
                        <h2 style="color: #7f5539; border-bottom: 2px solid #ddb892; padding-bottom: 10px; text-align: center;">&#128722; sugar.krafts Checkout Order</h2>
                        <p style="font-size: 16px;"><strong>Customer Name:</strong> {name}</p>
                        <p style="font-size: 16px;"><strong>Customer Email:</strong> <a href="mailto:{email}">{email}</a></p>
                        <p style="font-size: 16px;"><strong>Delivery Option:</strong> <span style="text-transform: capitalize; font-weight: bold; color: #a57e7e;">{delivery}</span></p>
                        <p style="font-size: 16px;"><strong>Shipping/Pickup Address:</strong> {address}</p>
                        
                        <hr style="border: 0; border-top: 1px solid #ddb892; margin: 20px 0;">
                        <h3 style="color: #7f5539; margin-bottom: 15px;">Order Summary</h3>
                        <table style="width: 100%; border-collapse: collapse; background: #faf5ef; border-radius: 8px; overflow: hidden; border: 1px solid #e6ccb2;">
                            <thead>
                                <tr style="background-color: #ddb892; color: #ffffff;">
                                    <th style="padding: 10px; text-align: left;">Item</th>
                                    <th style="padding: 10px; text-align: center; width: 60px;">Qty</th>
                                    <th style="padding: 10px; text-align: right; width: 80px;">Price</th>
                                    <th style="padding: 10px; text-align: right; width: 100px;">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cart_html}
                                <tr style="background-color: #e6ccb2; font-weight: bold;">
                                    <td colspan="3" style="padding: 12px; text-align: right; font-size: 16px; color: #7f5539;">Order Total:</td>
                                    <td style="padding: 12px; text-align: right; font-size: 18px; color: #7f5539;">${total:.2f}</td>
                                </tr>
                            </tbody>
                        </table>
                        
                        <hr style="border: 0; border-top: 1px solid #ddb892; margin: 25px 0;">
                        <p style="font-size: 13px; color: #a57e7e; text-align: center;">This order request was submitted via the checkout form on sugar.krafts.</p>
                    </div>
                    """
                    subject = f"🛒 sugar.krafts Order from {name} (${total:.2f})"
                else:
                    # Custom Order request
                    email_html = f"""
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e3d5ca; border-radius: 8px; background-color: #f5ebe0;">
                        <h2 style="color: #7f5539; border-bottom: 2px solid #ddb892; padding-bottom: 10px;">&#127880; sugar.krafts Custom Order Request</h2>
                        <p style="font-size: 16px;"><strong>Customer Name:</strong> {name}</p>
                        <p style="font-size: 16px;"><strong>Customer Email:</strong> <a href="mailto:{email}">{email}</a></p>
                        <hr style="border: 0; border-top: 1px solid #ddb892; margin: 20px 0;">
                        <p style="font-size: 16px; font-weight: bold; color: #7f5539;">Order Customization Details:</p>
                        <div style="white-space: pre-wrap; background: #faf5ef; padding: 15px; border-radius: 5px; font-size: 15px; border: 1px solid #e6ccb2;">{details}</div>
                        <hr style="border: 0; border-top: 1px solid #ddb892; margin: 20px 0;">
                        <p style="font-size: 16px; font-weight: bold; color: #7f5539;">Shipping / Pickup Address:</p>
                        <div style="white-space: pre-wrap; background: #faf5ef; padding: 15px; border-radius: 5px; font-size: 15px; border: 1px solid #e6ccb2;">{address}</div>
                        <hr style="border: 0; border-top: 1px solid #ddb892; margin: 20px 0;">
                        <p style="font-size: 13px; color: #a57e7e;">This order request was submitted via the sugar.krafts website.</p>
                    </div>
                    """
                    subject = f"🎀 sugar.krafts Custom Order from {name}"
                
                payload = {
                    "from": "sugar.krafts <onboarding@resend.dev>",
                    "to": ["sugar.krafts12@gmail.com"],
                    "subject": subject,
                    "html": email_html,
                    "reply_to": email
                }
                
                # Use curl — most reliable way to call Resend from Python
                result = subprocess.run(
                    [
                        "curl", "-s", "-w", "\n%{http_code}",
                        "-X", "POST",
                        "https://api.resend.com/emails",
                        "-H", f"Authorization: Bearer {RESEND_API_KEY}",
                        "-H", "Content-Type: application/json",
                        "-d", json.dumps(payload)
                    ],
                    capture_output=True,
                    text=True,
                    timeout=15
                )
                
                output_lines = result.stdout.strip().split('\n')
                http_code = int(output_lines[-1]) if output_lines[-1].isdigit() else 0
                response_body = '\n'.join(output_lines[:-1])
                
                print(f"Resend response [{http_code}]: {response_body}")
                
                if http_code in (200, 201):
                    print(f"✓ Email sent for {name} ({email})")
                    self.send_response(200)
                    self.send_header('Content-Type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    self.wfile.write(json.dumps({"success": True}).encode('utf-8'))
                else:
                    print(f"✗ Resend error {http_code}: {response_body}")
                    self.send_response(500)
                    self.send_header('Content-Type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    self.wfile.write(json.dumps({"success": False, "error": response_body}).encode('utf-8'))

            except Exception as e:
                print(f"Server error: {str(e)}")
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode('utf-8'))
        else:
            super().do_POST()

    def log_message(self, format, *args):
        print(f"{self.address_string()} - {format % args}")

Handler = CustomHandler

class CustomTCPServer(socketserver.TCPServer):
    allow_reuse_address = True

print(f"sugar.krafts server starting on http://127.0.0.1:{PORT} ...")
with CustomTCPServer(("127.0.0.1", PORT), Handler) as httpd:
    print(f"✓ Server ready at http://127.0.0.1:{PORT}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("Server stopped.")
