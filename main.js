//! gerekli HTML elementlerini seç
const form =  document.querySelector(".grocery-form");
const grocery = document.getElementById("grocery");
const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");
const alert = document.querySelector(".alert");
const submitBtn = document.querySelector(".submit-btn");
const clearBtn = document.querySelector(".clear-btn");

//! Düzenleme seçenekleri
let editElement;
let editFlag = false; //düzenleme modunda olup olmadığını belirtir
let editID = ""; //düzenleme yapılan öğenin benzersiz kimliği

//! Fonksiyonlar
const setBackToDefault = () =>{
  grocery.value = "";
  editFlag = false;
  editID = "";
  submitBtn.textContent = "Ekle";
};


const displayAlert = (text, action) => {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);
  setTimeout(()=>{
   alert.textContent = "";
   alert.classList.remove(`alert-${action}`);
  },2000);
};

//tıklanıldığında "article" etiketini ekrandan kaldıracak fonksıyon
const deleteItem = (e) => {
 const element = e.currentTarget.parentElement.parentElement; //article etiketine eriştik
const id = element.dataset.id;
list.removeChild(element);//list etiketinden "article" etiketini kaldırdık
 displayAlert("Öge Kaldırıldı", "danger");
 setBackToDefault();
 removeFromLocalStorage(id);
};

const editItem = (e) => {//"article" etiketine parentElement sayesinde eriştik
  const element = e.currentTarget.parentElement.parentElement;
  editElement = e.currentTarget.parentElement.previousElementSibling;//buttonun kapsayıcısına eriştikten sonra kardeş etikete eriştik
  //tıkladığım "article" etiketi içindeki p etiketinin text ini inputun içerisine gönderme
  grocery.value = editElement.innerText;
  editFlag = true;
  editID = element.dataset.id; //düzenlenen ögenin kimliğine erişme
  submitBtn.textContent = "Düzenle"; //submitBtn nin textini güncelledik (düzenle)
};

const addItem = (e) => {
  e.preventDefault(); //Formun otomatik olarak gönderilmesini engelledi
  const value = grocery.value;  //Form içerisinde bulunan inputun değerini aldık
  const id = new Date().getTime().toString(); //*Benzersiz bir ıd olusturduk
 
  if(value !== "" && !editFlag){ //*eger input boş değilse ve düzenleme modunda değilse çalışacak blok yapısı
     const element = document.createElement("article"); //*yeni bir "article" etiketi oluşturduk
     let attr = document.createAttribute("data-id"); //* yeni bir veri kimliği oluşturur
     attr.value = id;
     element.setAttributeNode(attr); //* oluşturulan id yi "article" etiketine ekler
     element.classList.add("grocery-item");//*oluşturduğumuz "article" etiketine class ekledik
    
     element.innerHTML =   
     ` <p class="title">${value}</p>
      <div class="btn-container">
         <button type="button" class="edit-btn">  <i class="fa-solid fa-pen-to-square"></i></button>
         <button type="button" class="delete-btn"><i class="fa-solid fa-trash"></i></button>
     </div> `;

   const deleteBtn = element.querySelector(".delete-btn");
   deleteBtn.addEventListener("click", deleteItem);

   const editBtn = element.querySelector(".edit-btn");
   editBtn.addEventListener("click",editItem);

     //kapsayıcıya olusturduğumuz "article" etiketini ekledik
    list.appendChild(element);
     displayAlert("Başariyla Eklenildi.", "success");
     container.classList.add("show-container");

     //localstorage a ekleme
     addToLocalStorage(id, value);

     //değerleri sarsayılana çevirir
     setBackToDefault();
  } else if(value !== "" && editFlag){
    // değiştireceğimiz p etiketinin içerik kısmına kullanıcının inputa girdiği değeri gönderdik
    editElement.innerText = value;
    // ekrana alert yapısını bastırdık
    displayAlert("Değer Değiştirildi", "success");
    editLocalStorage(editID, value);
     setBackToDefault();
  };
};

const clearItems = () => {
   const items = document.querySelectorAll(".grocery-item");
   //listede öge varsa çalişir
   if(items.length > 0 ){
    items.forEach((item) => list.removeChild(item)); 
   };
   //container yapısını gizle
   container.classList.remove("show-container");
   displayAlert("Liste Boş", "danger");
   setBackToDefault();
};

const  createListItem = (id, value) => {
  const element = document.createElement("article"); //*yeni bir "article" etiketi oluşturduk
  let attr = document.createAttribute("data-id"); //* yeni bir veri kimliği oluşturur
  attr.value = id;
  element.setAttributeNode(attr); //* oluşturulan id yi "article" etiketine ekler
  element.classList.add("grocery-item");//*oluşturduğumuz "article" etiketine class ekledik
 
  element.innerHTML =   
  ` <p class="title">${value}</p>
   <div class="btn-container">
      <button type="button" class="edit-btn">  <i class="fa-solid fa-pen-to-square"></i></button>
      <button type="button" class="delete-btn"><i class="fa-solid fa-trash"></i></button>
  </div> `;

   const deleteBtn = element.querySelector(".delete-btn");
   deleteBtn.addEventListener("click", deleteItem);
   const editBtn = element.querySelector(".edit-btn");
   editBtn.addEventListener("click",editItem);

   //kapsayıcıya olusturduğumuz "article" etiketini ekledik
   list.appendChild(element);
   container.classList.add("show-container");

};
const setupItems = () => {
  let items = getLocalStorage();
  if (items.length > 0) {
    items.forEach((item) => {
      createListItem(item.id, item.value);
    });
  }
};



//! LOCAL STORAGE

// yerel depoya öğe ekleme işlemi
const addToLocalStorage = (id, value) => {
  const grocery = { id, value };
  let items = getLocalStorage();
  items.push(grocery);
  console.log(items);
  localStorage.setItem("list", JSON.stringify(items));
};

// yerel depodan öğeleri alma işlemi
const getLocalStorage = () => {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
};

//localStorage den veri silme
const removeFromLocalStorage = (id) => {
  //localstorageden verileri getir
  let items = getLocalStorage();
   // tıkladığım etiketin idsi ile localStorageda ki id eşit değilse bunu diziden çıkar ve yeni bir elemana aktar 
  items = items.filter((item) =>{
    if(item.id !== id){
      return item;
    };
  });
  console.log(items);
  localStorage.setItem("list",JSON.stringify(items));
};

// Yerel depoda update işlemi
const editLocalStorage = (id,value) => {
 let items = getLocalStorage();
  // yerel depodaki verilerin id ile güncellenecek olan verinin idsi biribirne eşit ise inputa girilen value değişkenini al
  // localStorageda bulunan verinin valuesuna aktar
 items = items.map((item) => {
  if(item.id === id) {
    item.value = value;
  }
  return item;
 });
 localStorage.setItem("list", JSON.stringify(items));
};


//!olay izleyicileri
form.addEventListener("submit", addItem);
clearBtn.addEventListener("click", clearItems);
window.addEventListener("DOMContentLoaded",setupItems);