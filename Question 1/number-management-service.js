const express = require('express');
const app = express();
const axios = require('axios');

// QuickSort function
function quickSort(arr) {
  if (arr.length <= 1) return arr;

  const pivot = arr[arr.length - 1];
  const left = [];
  const right = [];

  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] < pivot) left.push(arr[i]);
    else right.push(arr[i]);
  }

  return [...quickSort(left), pivot, ...quickSort(right)];
}

app.get('/numbers', async (req, res) => {
  const urls = Array.isArray(req.query.url) ? req.query.url : [req.query.url];
  const numbers = [];

  try {
    const responses = await Promise.all(
      urls.map(async (url) => {
        try {
          const response = await axios.get(url);
          return response.data;
        } catch (error) {
          console.error("Error fetching data from remote API:", error.message);
          return null;
        }
      })
    );

    for (const data of responses) {
      if (data) {
        numbers.push(...data.numbers);
      }
    }

    // Remove duplicates from the numbers array
    const uniqueNumbers = Array.from(new Set(numbers));

    // Use QuickSort to sort the unique numbers in ascending order
    const sortedNumbers = quickSort(uniqueNumbers);

    res.json({
      numbers: sortedNumbers,
    });
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ error: "Error fetching data" });
  }
});

app.listen(8008, () => {
  console.log('Server running at http://localhost:8008');
});
