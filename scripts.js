const toggler = document.querySelector(".toggler")
const sendMessage = document.querySelector(".send-message")
const textarea = document.querySelector("textarea")
const closer = document
  .querySelector(".close")
  .addEventListener("click", openChat)
const initialTextAreaHeight = textarea.scrollHeight

async function createBotReply(content) {
  const API_URL = ""
  const API_KEY = ""

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content,
        },
      ],
    }),
  })

  const data = await response.json()

  return data.choices[0].message.content
}

function openChat() {
  toggler.parentElement.classList.toggle("open-chat")
}

function createChatMessage(message, type) {
  const li = document.createElement("li")
  li.classList.add("message", type)
  const p = document.createElement("p")

  if (type === "bot") {
    const i = document.createElement("i")
    i.classList.add("fa-robot", "fa-solid", "fa-xl")
    li.appendChild(i)
  }

  p.textContent = message
  li.appendChild(p)

  return li
}

function handleAutoSize() {
  textarea.style.height = `${initialTextAreaHeight}px`
  textarea.style.height = `${textarea.scrollHeight}px`
}

function handleChatOnKeyDown(event) {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault()
    handleChat()
  }
}

toggler.addEventListener("click", openChat)

async function handleChat() {
  const textareaValue = textarea.value.trim()

  if (!textareaValue) {
    return
  }

  const main = document.querySelector("main")
  const ul = document.querySelector("ul")

  const userMessage = createChatMessage(textareaValue, "user")

  ul.appendChild(userMessage)
  main.scrollTo(0, main.scrollHeight)

  textarea.value = ""

  const botMessage = createChatMessage("Digitando...", "bot")

  setTimeout(() => {
    ul.appendChild(botMessage)
    main.scrollTo(0, main.scrollHeight)
  }, 500)

  try {
    const botReply = await createBotReply(textareaValue)

    const p = botMessage.querySelector("p")
    p.textContent = botReply

    main.scrollTo(0, main.scrollHeight)
  } catch (error) {
    const p = botMessage.querySelector("p")
    p.textContent =
      "Ops! Algo não está funcionando como deveria. Por favor, tente novamamente ou contacte o desenvolvedor ;)"
    p.classList.add("error")
  }
}

sendMessage.addEventListener("click", handleChat)
