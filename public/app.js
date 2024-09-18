// تهيئة Firebase
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: "",
};

firebase.initializeApp(firebaseConfig);

// مرجع Realtime Database
const database = firebase.database();

// تابع لتحميل وتحديث البيانات
function loadDataAndUpdateUI(sectionId) {
  database
    .ref("profile")
    .once("value")
    .then((snapshot) => {
      const data = snapshot.val();
      console.log("Fetched data:", data);

      if (data) {
        // تحديث كل قسم بناءً على الـ sectionId
        switch (sectionId) {
          case "home":
            updateHomeSection(data);
            break;
          case "about":
            updateAboutSection(data);
            break;
          case "contact":
            updateContactSection(data);
            break;
          default:
            console.warn("Unknown section:", sectionId);
        }
      } else {
        console.warn("No data found in Firebase.");
      }
    })
    .catch((error) => {
      console.error("Error fetching data from Firebase:", error);
    });
}

// تحديث قسم "الصفحة الرئيسية"
function updateHomeSection(data) {
  const profileImage = document.querySelector(".header .image img");
  if (profileImage) {
    profileImage.src = data["profile-image"] || "img/3.jpg";
  }

  const nameElement = document.querySelector(".header .name");
  if (nameElement) {
    nameElement.innerHTML = `Hi, I'm DR. <span>${
      data.name || "Hesham Nigm"
    }</span> ${data["job-title"] || "Instructor"}.`;
  }

  const introductionElement = document.querySelector(".header p");
  if (introductionElement) {
    introductionElement.textContent =
      data["home-resume"] || "I am currently working as a Sales Manager...";
  }

  const downloadCVButtons = document.querySelectorAll(".btn-con a");
  if (downloadCVButtons.length > 0) {
    downloadCVButtons.forEach((button) => {
      button.href = data.cv || "#";
    });
  }
}

// تحديث قسم "حول" (About)
function updateAboutSection(data) {
  const aboutItems = document.querySelectorAll(".about-item");
  if (aboutItems.length > 0) {
    if (aboutItems[0])
      aboutItems[0].querySelector(".large-text").textContent =
        `+${data.students}` || "100+";
    if (aboutItems[1])
      aboutItems[1].querySelector(".large-text").textContent =
        `+${data.experience}` || "12+";
    if (aboutItems[2])
      aboutItems[2].querySelector(".large-text").textContent =
        `+${data.clients}` || "500+";
    if (aboutItems[3])
      aboutItems[3].querySelector(".large-text").textContent =
        `+${data.reviews}` || "400+";
  }

  // تحديث "عنّي" (about-me)
  const aboutMeElement = document.querySelector(".left-about h4 + p");
  if (aboutMeElement) {
    aboutMeElement.textContent =
      data["about-me"] ||
      "I am a dedicated professional with years of experience...";
  }
}

// تحديث قسم "الاتصال" (Contact)
function updateContactSection(data) {
  const contactItems = document.querySelectorAll(".contact-item");
  if (contactItems.length > 0) {
    if (contactItems[0])
      contactItems[0].querySelector("p").textContent =
        data.location || "Cairo, Egypt";
    if (contactItems[1])
      contactItems[1].querySelector("p").textContent =
        data.email || "HeshamNegm@gmail.com";
    if (contactItems[2])
      contactItems[2].querySelector("p").textContent =
        data.education || "Cairo University, Egypt";
    if (contactItems[3])
      contactItems[3].querySelector("p").textContent =
        data.phone || "+20 101 493 4234";
    if (contactItems[4])
      contactItems[4].querySelector("p").textContent =
        data.languages || "Arabic, English, Spanish";
  } else {
    console.warn("No contact items found.");
  }

  // تحديث الروابط الخاصة بوسائل التواصل الاجتماعي
  const socialMediaLinks = {
    facebook: data.facebook || "https://www.facebook.com/hesham.nigm",
    twitter: data.twitter || "#",
    linkedin: data.linkedin || "#",
    youtube: data.youtube || "#",
  };

  const contactIcons = document.querySelector(".contact-icons .contact-icon");

  // تحديث الروابط في الأيقونات
  if (contactIcons) {
    const facebookLink =
      contactIcons.querySelector(".fab.fa-facebook-f").parentElement;
    const twitterLink =
      contactIcons.querySelector(".fab.fa-twitter").parentElement;
    const linkedinLink =
      contactIcons.querySelector(".fab.fa-linkedin").parentElement;
    const youtubeLink =
      contactIcons.querySelector(".fab.fa-youtube").parentElement;

    if (facebookLink) facebookLink.href = socialMediaLinks.facebook;
    if (twitterLink) twitterLink.href = socialMediaLinks.twitter;
    if (linkedinLink) linkedinLink.href = socialMediaLinks.linkedin;
    if (youtubeLink) youtubeLink.href = socialMediaLinks.youtube;
  }

  // تحديث التعريف البسيط في قسم الاتصال
  const contactIntro = document.querySelector(".left-contact h4 + p");
  if (contactIntro) {
    contactIntro.textContent =
      data["contact-resume"] ||
      "Feel free to contact me for collaborations or inquiries!";
  }
}

// تابع لتغيير الأقسام بناءً على النقر على الأزرار
function handleSectionChange(sectionId) {
  const sections = document.querySelectorAll(".container");
  sections.forEach((section) => {
    section.style.display = "none"; // إخفاء جميع الأقسام
  });

  const activeSection = document.getElementById(sectionId);
  if (activeSection) {
    activeSection.style.display = "block"; // إظهار القسم المختار
    loadDataAndUpdateUI(sectionId); // تحميل البيانات وتحديث القسم
  }
}

// إضافة مستمعات الأحداث للنقر على الأيقونات
const controls = document.querySelectorAll(".control");
controls.forEach((control) => {
  control.addEventListener("click", (e) => {
    const sectionId = e.currentTarget.getAttribute("data-id");

    // إزالة الفئة "active-btn" من جميع الأزرار وإضافتها للزر الحالي
    controls.forEach((btn) => btn.classList.remove("active-btn"));
    e.currentTarget.classList.add("active-btn");

    // تغيير القسم عند النقر على الزر
    handleSectionChange(sectionId);
  });
});

// تبديل بين الوضع الليلي والوضع النهاري عند النقر على زر الثيم
const themeBtn = document.querySelector(".theme-btn");
themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

// بدء المراقبة عند تحميل الصفحة
window.onload = () => {
  handleSectionChange("home"); // ابدأ بالقسم الرئيسي "home"
};

(function () {
  [...document.querySelectorAll(".control")].forEach((button) => {
    button.addEventListener("click", function () {
      document.querySelector(".active-btn").classList.remove("active-btn");
      this.classList.add("active-btn");
      document.querySelector(".active").classList.remove("active");
      document.getElementById(button.dataset.id).classList.add("active");
    });
  });
  document.querySelector(".theme-btn").addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
  });
})();
