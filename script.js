"use strict";

const inputToDo = document.querySelector(".input_todo");
const submitBtn = document.querySelector(".btn");
const overlay = document.querySelector(".overlay");

const url = "http://localhost:3000/posts/";
const xhr = new XMLHttpRequest();

// post request for sending the data
function sendInputData(e) {
  e.preventDefault();

  let emptyInputValue = false;

  if (inputToDo.value.trim() === "") {
    emptyInputValue = true;
  }

  if (emptyInputValue === false) {
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        let json = JSON.parse(xhr.responseText);
        console.log(json);
      }
    };

    let data = JSON.stringify({
      title: inputToDo.value,
    });

    xhr.send(data);

    inputToDo.value = "";
  } else {
    overlay.style.display = "block";
  }
}

// removing overlay on click
function removeOverlay() {
  overlay.style.display = "none";
}

submitBtn.addEventListener("click", sendInputData);
overlay.addEventListener("click", removeOverlay);

//immediately invoked function for getting all data from data base
// get request
function showAllTodos() {
  let html = "";
  const todos = document.querySelector(".todos");

  xhr.open("GET", url, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      let data = JSON.parse(xhr.responseText);
      // calling all in list
      for (let i = 0; i < data.length; i++) {
        html = `<div class="todos">
        <p class="todo">${i + 1}.
          ${data[i].title}
          <button class="remove_todo_btn">
            <span class="material-symbols-outlined" onclick="removeOneTodo(${
              data[i].id
            })"> close </span>
          </button>
        </p>
      </div>`;
        todos.insertAdjacentHTML("afterend", html);
      }
    }
  };
  xhr.send(null);
}

showAllTodos();

// delete request for todos

const removeBtn = document.querySelectorAll(".remove_todo_btn");

function removeOneTodo(todoId) {
  xhr.open("DELETE", url + todoId, true);
  xhr.onload = function () {
    let todo = JSON.parse(xhr.responseText);
    if (xhr.readyState === 4 && xhr.status === 200) {
      console.log(todo);
    } else {
      overlay.style.display = "block";
    }
  };
  xhr.send(null);
}
