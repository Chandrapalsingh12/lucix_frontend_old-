import bot from "./assets/bot1.svg";
import user from "./assets/user.svg";

const form = document.querySelector("form");
const chatConatiner = document.querySelector("#chat_container");

const hidden = document.getElementById("hide")
const typeTextss = document.getElementById("typetext")

document.getElementById("close-btn").addEventListener("click", function() {
  document.getElementById("message-box").style.display = "none";
});


typeText(typeTextss,"Welcome to Luci X",100)

let loadInterval;

function loader(element) {
  element.textContent = "";
  loadInterval = setInterval(() => {
    element.textContent += ".";
    if (element.textContent === "....") {
      element.textContent = "";
    }
  }, 300);
}

function typeText(element,text,speed=20){
  let index = 0;

  let interval = setInterval(()=>{
    if(index < text.length){
      element.innerHTML += text.charAt(index);
      index++;
    }else{
      clearInterval(interval)
    }
  },speed)
}


function generateuniqueId(){
  const timstam = Date.now()
  const randomNumber = Math.random()
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timstam}-${hexadecimalString}`;
}


function chatStrip(isAi,value,uniqueId){
  return(
    `
    <div class="wrapper ${isAi && 'ai'}">
      <div class="chat">
        <div class="profile">
          <img
          src = ${isAi ? bot:user}
          alt = ${isAi ? 'bot':'user'}
          />
        </div>
        <div class="message" id=${uniqueId}>${value}</div>
      </div>
    </div>
    `
  )
}

const handelSubmit = async(e)=>{
  e.preventDefault();

  const data = new FormData(form);
  chatConatiner.innerHTML += chatStrip(false,data.get('prompt'));
  form.reset()

  const uniqueId = generateuniqueId()
  chatConatiner.innerHTML+= chatStrip(true," ",uniqueId);

  chatConatiner.scrollTop = chatConatiner.scrollHeight;

  const messageDiv = document.getElementById(uniqueId)
  loader(messageDiv);

  if (data.get("prompt").indexOf("create you") > -1){
    typeText(messageDiv,"I'm created by Lucifer...")
    clearInterval(loadInterval)
  }
  else if(data.get("prompt").toUpperCase().indexOf("your name".toUpperCase()) > -1){
    typeText(messageDiv,"My name is Luci X. I can do anything.")
    clearInterval(loadInterval)

  }
  // else if(data.get("prompt").toUpperCase().indexOf("hi".toUpperCase()) > -1){
  //   typeText(messageDiv,"Hello. Welcome to LuciX. What Can I Help You...")
  //   clearInterval(loadInterval)
  // }
  else if(data.get("prompt").toUpperCase().indexOf("is chandrapal singh".toUpperCase()) > -1){
    typeText(messageDiv,"Chandrapal Singh is my creator 🥰")
    clearInterval(loadInterval)
  }

  else{
    const url = 'https://lucix-backend-gpt-turbo.onrender.com'
  // fetch data

  const response = await fetch(url,{
    method:"POST",
    headers:{
      "Content-Type":'application/json'
    },
    body:JSON.stringify({
      messages: [
        {
          role: 'user',  // Assuming a single user role
          content: data.get('prompt'),  // Use the prompt data as the content
        },
      ],
    })

  })
  clearInterval(loadInterval);
  messageDiv.innerHTML = '';

  if(response.ok){
    ;
    const data = await response.json();

    console.log("Data is",data);
    const parseData = data.bot.content.trim();

    typeText(messageDiv,parseData)
  }else{
    const err = await response.text()

    messageDiv.innerHTML = "Somthing went wrong "

    alert(err)
  }
}

}

document.getElementById("btn_click").onclick = function() {myFunction()};

function myFunction() {
  hidden.style.display="none"
  
}





form.addEventListener("submit",handelSubmit);
form.addEventListener('keyup',(e)=>{
  if(e.keyCode===13){
    handelSubmit(e)
    hidden.style.display="none"

  }
})