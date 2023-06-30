function changeStyleSheet() {
    var styleSheet = document.getElementById("styleSheet");
    
    if (styleSheet.getAttribute("href") === "main_page_style.css") {
      styleSheet.setAttribute("href", "main_page_style2.css");
    } else {
        if (styleSheet.getAttribute("href") === "main_page_style2.css") {
            styleSheet.setAttribute("href", "main_page_style3.css");
          } else {
            styleSheet.setAttribute("href", "main_page_style.css");
          }
    }
  }
  