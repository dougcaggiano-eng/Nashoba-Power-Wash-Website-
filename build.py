import base64
s=open("app.js").read()
logo='data:image/webp;base64,'+base64.b64encode(open('logo.webp','rb').read()).decode()
open('index.html','w').write(open('template.html').read().replace('{{LOGO}}',logo).replace('{{SCRIPT}}',s))
