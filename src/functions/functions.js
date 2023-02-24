/* global clearInterval, console, setInterval */

/**
 * Content Moderation using ChatGPT
 * @customfunction
 * @param {string} text The text to be checked
 * @returns {string} Result whether the modertaion has passed or failed.
 */
export function moderation(text) {
  const url = "https://api.openai.com/v1/moderations";
  const apikey = process.env.OPENAI_API_KEY;
  const method = "POST";
  const model = "text-moderation-latest";
  return new Promise(function (resolve, reject) {
    if (!text) {
      resolve("Blank");
  }
  fetch(url, {
    method: method,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apikey
    },
    body: JSON.stringify({
        'model': model,
        'input': text
    })
})
.then(function (response){
  return response.json();
  }
)
.then(function (json) {
  const response = JSON.stringify(json.results[0].flagged);
  let result = "";
  let cellcolor = "";
  if (response === "false") {
    result = "Passed";
    cellcolor = "green";
  } else if (response === "true") {
    result = "Failed";
    cellcolor = "red";
  } else {
    result = "Error";
  }
  resolve(result);
})
})
}


/**
 * Sentiment Analysis using ChatGPT
 * @customfunction
 * @param {string} text The text to be analyzed
 * @returns {string} Result whether the text is Positive, Negative or Neutral.
 */
export function sentiment(text) {
  const url = "https://api.openai.com/v1/completions";
  const apikey = process.env.OPENAI_API_KEY;
  const method = "POST";
  const model = "text-curie-001";
  const prefix = "Decide whether a Tweet's sentiment is positive, neutral, or negative. Tweet:";
  const suffix = "Sentiment: ";
  return new Promise(function (resolve, reject) {
    if (!text) {
      resolve("Blank");
  }
  fetch(url, {
    method: method,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apikey
    },
    body: JSON.stringify({
        'model': model,
        'prompt': prefix + text + suffix,
        'max_tokens': 20,
        'temperature': 0,
        'top_p': 1,
        'frequency_penalty': 0.5,
        'presence_penalty': 0,
        'n': 1
    })
})
.then(function (response){
  return response.json();
  }
)
.then(function (json) {
  const response = JSON.stringify(json.choices[0].text);
  let response2 = response.replace(/\\n/g, '').replace(/['"]+/g, '');
  let response3 = response2.toLowerCase().charAt(0).toUpperCase() + response2.slice(1);
  resolve(response3);
})
})
}