exports.passResetEmailTemplate = (req, resettoken) => {
  return `
<head>
<style type="text/css">
h3{
  text-align:center;
  margin: 10px auto;
  width: 100%;
}
.email-body{
    padding: 1rem;
    margin: 1rem auto;
    line-height: 1.5;
}
.btn-container{
  width: 150px;
  text-align: center;
  padding: 1rem;
  width: 100%;
}
.email-link{
    text-decoration: none;
    color: white;
    background: black;
    outline: none;
    curser: pointer;
    border-radius: 10px;
    padding: 1rem;
}
.email-link:hover{
    background:#333;
}
.email-link:active{
    transform:scale(0.98);
}
</style>
</head>
  <body>
  <h3> Password Reset</h3>
  <p class="email-body">You are receiving this email because you (or some else ) requested to reset your password.
  Kindly disregard this email if it wasn't you who requested to do so otherwise click the link
  to below to reset your password
  <div class="btn-container"><a class="email-link" href="${
    req.protocol
  }://${req.get(
    "host"
  )}/api/auth/resetpassword/${resettoken}">Click here</a></div></p>
  </body>
  `;
};
