const baseUrl = "";
const form = document.querySelector("#myForm");
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.querySelector("#name").value;
  const email = document.querySelector("#email").value;
  const subject = document.querySelector("#subject").value;
  const message = document.querySelector("#message").value;

  const response = await fetch(baseUrl + "/contact/send-email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      subject,
      message,
    }),
  }).then((res) => {
    if (res.status == 200) {
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Your Message is Sent!",
        showConfirmButton: false,
        timer: 1500,
      });
      setTimeout(submit, 2000);
    } else if (res.status == 400) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong! Please Try again later",
        footer: '<a href="">Why do I have this issue?</a>',
      });
    }
  });
});
let submit = function () {
  form.submit();
};
