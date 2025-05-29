document.addEventListener("DOMContentLoaded", () => {
  const classificationForm = document.querySelector("form[action='/inv/add-classification']")
  if (classificationForm) {
    classificationForm.addEventListener("submit", function (e) {
      const input = document.getElementById("classification_name")
      const regex = /^[a-zA-Z0-9]+$/
      if (!regex.test(input.value)) {
        alert("Classification name must not contain spaces or special characters.")
        e.preventDefault()
      }
    })
  }

  // Add Inventory form validation
  const inventoryForm = document.querySelector("form[action='/inv/add-inventory']")
  if (inventoryForm) {
    inventoryForm.addEventListener("submit", function (e) {
      const fields = [
        "inv_make", "inv_model", "inv_year", "inv_description",
        "inv_image", "inv_thumbnail", "inv_price", "inv_miles", "inv_color"
      ]

      let hasError = false

      fields.forEach(id => {
        const input = document.getElementById(id)
        if (!input || !input.value.trim()) {
          alert(`Please fill out the ${id.replace("inv_", "").replace("_", " ")} field.`)
          hasError = true
        }
      })

      const year = document.getElementById("inv_year")
      if (year && (year.value < 1900 || year.value > 2099)) {
        alert("Year must be between 1900 and 2099.")
        hasError = true
      }

      if (hasError) e.preventDefault()
    })
  }
})
