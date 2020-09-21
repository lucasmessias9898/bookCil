const currentPage = location.pathname
const menuItens = document.querySelectorAll("header .primary a")

for (item of menuItens) {
  if(currentPage.includes(item.getAttribute("href"))) {
    item.classList.add("active")
  }
}

const Mask = {
  apply(input, func){

    setTimeout(function() {
      input.value = Mask[func](input.value)
  
    }, 1)
  },
  format(value) {
    value = value.replace(/\D/g,"")

    /*return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value/100)*/

    return value
  }
}

const PdfUpload = {
  input: "",
  preview:  document.querySelector('#pdf-preview'),
  uploadLimit: 1,
  files: [],
  handleFileInput(event) {
    const { files: fileList } = event.target
    PdfUpload.input = event.target

    if(PdfUpload.hasLimit(event)) return

    Array.from(fileList).forEach(file => {

      PdfUpload.files.push(file)

      const reader = new FileReader

      reader.onload = () => {
        const pdf = new Image()
        pdf.src = String("https://lh3.googleusercontent.com/10WLpgUsCM9MpJSIt51kf-HGTsTUAfQoBIwY249RW87Z0ggVDI9_zyOBfBZc-pTltQ")
        
        const div = PdfUpload.getContainer(pdf)
        PdfUpload.preview.appendChild(div)

      }

      reader.readAsDataURL(file)
    })

    PdfUpload.input.files = PdfUpload.getAllFiles()
  },
  hasLimit(event) {
    const { uploadLimit, input, preview } = PdfUpload
    const { files: fileList } = input

    if(fileList.length > uploadLimit) {
      alert(`Envie no máxio ${uploadLimit} pdf`)
      event.preventDefault()
      return true
    }

    const pdfsDiv = []
    preview.childNodes.forEach(item => {
      if(item.classList && item.classList.value == "pdf")
        pdfsDiv.push(item)
    })

    const totalPdfs = fileList.length + pdfsDiv.length
    if(totalPdfs > uploadLimit) {
      alert("Você atingiu o limite máximo de pdfs")
      event.preventDefault()
      return true
    }
    return false
  },
  getAllFiles() {
    const dataTransfer = new ClipboardEvent("").clipboardData || new DataTransfer()

    PdfUpload.files.forEach(file => dataTransfer.items.add(file))

    return dataTransfer.files
  },
  getContainer(pdf) {
    const div = document.createElement('div')
    div.classList.add('pdf')
    div.onclick = PdfUpload.removePdf
    div.appendChild(pdf)
    div.appendChild(PdfUpload.getRemoveButton())

    return div
  },
  getRemoveButton() {
    const button = document.createElement('i')
    button.classList.add('material-icons')
    button.innerHTML = "close"

    return button
  },
  removePdf(event) {
    const pdfDiv = event.target.parentNode
    const pdfsArray = Array.from(PdfUpload.preview.children)
    const index = pdfsArray.indexOf(pdfDiv)

    PdfUpload.files.splice(index, 1)
    PdfUpload.input.files = PdfUpload.getAllFiles()

    pdfDiv.remove()
  },
  removeOldPdf(event) {
    const pdfDiv = event.target.parentNode

    if(pdfDiv.id) {
      const removedFiles = document.querySelector('input[name="removed_files"]')

      if(removedFiles) {
        removedFiles.value += `${pdfDiv.id},`
      }
    }

    pdfDiv.remove()    
  }
}

const Validate = {
  apply(input, func) {
    Validate.clearErrors(input)

    let results = Validate[func](input.value)
    input.value = results.value

    if(results.error)
      Validate.displayError(input, results.error)
  },
  displayError(input, error) {
    const div = document.createElement('div')
    div.classList.add('error')
    div.innerHTML = error
    input.parentNode.appendChild(div)

    input.focus()
  },
  clearErrors(input) {
    const errorDiv = input.parentNode.querySelector(".error")
    if(errorDiv)
      errorDiv.remove()
  },
  isEmail(value) {
    let error = null
    const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

    if(!value.match(mailFormat))
      error = "Email inválido"

    return {
      error, 
      value
    }
  }
}