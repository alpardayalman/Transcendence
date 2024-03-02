registerButton = document.querySelector('.registerBtn');

registerButton.addEventListener('click', async function(event) {
  event.preventDefault();
  console.log(event);
  console.log(window.location.origin + '/api/register/');

  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const first_name = document.getElementById("firstname").value;
  const last_name = document.getElementById("lastname").value;
  const password1 = document.getElementById("password1").value;
  const password2 = document.getElementById("password2").value;
  const profilePhoto = document.getElementById("profilePhoto").files[0];

  // Girilen şifrelerin eşleşip eşleşmediğini kontrol et
  if (password1 !== password2) {
    alert("Passwords do not match!");
    return;
  }

  // Form verilerini JSON nesnesine dönüştürme
  const data = {
    username,
    first_name,
    last_name,
    email,
    password1,
    password2,
    profilePhoto: await toBase64(profilePhoto),
  };
  const csrfToken = getCookie('csrftoken');
  // API'ye POST isteği gönderme
  try {
    const response = await fetch("/api/register/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken, // CSRF token'ı eklemeyi unutmayın
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();
    console.log("Success:", responseData);
    alert(responseData.detail);

    // Başarılı kayıt sonrası işlemler burada
  } catch (error) {
    console.error("Error:", error);
    alert("Registration failed!");
  }
});

// Dosyayı base64 formatına dönüştürme yardımcı fonksiyonu
async function toBase64(file) {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}