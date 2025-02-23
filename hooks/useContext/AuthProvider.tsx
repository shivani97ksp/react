LocalStorage vs. SessionStorage?
Storage Type |	Persists After Refresh | Persists After Closing Browser |	Use Case
localStorage	|✅ Yes                 |	✅ Yes                        |	Good for "Remember Me" login
sessionStorage |	✅ Yes                |	❌ No                         |	Best for temporary authentication (logs out on close)

Best Practice: Use localStorage for long-term authentication, but never store sensitive information like passwords or full JWT tokens in localStorage because they are vulnerable to XSS attacks. 
Instead, use httpOnly cookies for security.

