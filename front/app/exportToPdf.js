
import * as jsPDF from 'jspdf'
import { Base64 } from 'js-base64'

const exportToPdf = (name) => {
    const svg = document.querySelector('#sheet > svg')
    const width = svg.getAttribute('width')
    const height = svg.getAttribute('height')

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const context = canvas.getContext('2d')

    const xml = new XMLSerializer().serializeToString(svg)
    const image64 = 'data:image/svg+xml;base64,' + Base64.encode(xml)
    const img = document.createElement('img')
    img.addEventListener('load', function() {
        context.drawImage(img, 0, 0, width, height)
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'px',
            format: 'a4'
        })
        const dataUrl = canvas.toDataURL('image/png')
        const svgWidth = 1030
        const a4width = 446 // a4 dimensions 446 x 632 px
        const ratio = a4width / svgWidth
        pdf.addImage(dataUrl, 'PNG', 0, 0, width * ratio , height * ratio)
        pdf.save(`${name}.pdf`)
    })
    img.src = image64
}

export default exportToPdf
