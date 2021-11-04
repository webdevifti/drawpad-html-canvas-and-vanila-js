// Get The Dom Element
const drawbtn = document.querySelector('#DrawBtn');
const paintTools = document.querySelector('.paint-tools');
const cancelPainting = document.querySelector('.btn-cancel-painting');
const downloadPainting = document.querySelector('.btn-download');
const add_tex_tbox = document.querySelector('.add-text-box');
const canvas = document.querySelector('#canvas');
const context = canvas.getContext('2d');

// Define Canvas Width and Height
canvas.width = window.innerWidth - 100;
canvas.height = 600;

// Canvas Start Background Will be White
let start_background_color = "white";
context.fillStyle = start_background_color;
context.fillRect(0,0, canvas.width, canvas.height); // Define a Reactanlge same to the canvas width and height

// Inital pen color is Black
let draw_color = "black";
let draw_width = "2"; // Inital pen Size is 2
let is_drawing = false; // initial drawing canvas is false

let restor_array = []; // initialize an array
let index = -1;

function addCircle(){
    context.beginPath();
    context.arc(200,200,30,0, Math.PI * 2, false);
    context.strokeStyle = "red";
    context.fillStyle = "blue";
    context.stroke();
}

function addLine(){
    context.lineWidth =2;
    context.beginPath();
    context.moveTo(100,100);
    context.lineTo(300,100);
    context.closePath();
    context.stroke();
}

// Change Color selected color round box
function change_color(element){
    draw_color = element.style.background;
}

// get color from color picker 
function pickerColorChange(value){
    draw_color = value.style.color;
}


// undo funtionality
function undo_last(){
    if(index <= 0){
        clear_canvas();
    }else{
        index -= 1;
        restor_array.pop();
        context.putImageData(restor_array[index], 0,0);
    }
}


// clear all functionality
function clear_canvas(){
    context.fillStyle = start_background_color;
    context.clearRect(0,0,canvas.width, canvas.height);
    context.fillRect(0,0,canvas.width, canvas.height);
    restor_array = [];
    index = -1;
}

// if the Paint button is clicked, user can draw the paint
drawbtn.addEventListener('click', () => {
    paintTools.classList.add('show');
    downloadPainting.classList.add('show');

    canvas.addEventListener("touchstart", start, false); // event for tab or mobile
    canvas.addEventListener("touchmove", draw, false); // window mouse event

    canvas.addEventListener("mousedown", start, false);
    canvas.addEventListener("mousemove", draw, false);

    canvas.addEventListener("touchend", stop, false);
    canvas.addEventListener("mouseup", stop, false);
    canvas.addEventListener("mouseout", stop, false);


    

    // Starting the painting
    function start(event){
        is_drawing = true;
        context.beginPath();
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        context.moveTo(x,y);
        event.preventDefault();
        draw(event)
    }

    // draw something on tha canvas
    function draw(event){
        
        if(is_drawing){
            const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
            context.lineTo(x,y);
            context.strokeStyle = draw_color;
            context.lineWidth = draw_width;
            context.lineCap = "round";
            context.lineJoin = "round";
            context.stroke();
        }
        event.preventDefault();
    }
    
    // stop painting
    function stop(event){
        if(is_drawing){
            context.stroke();
            context.closePath();
            is_drawing = false;
        }
        event.preventDefault();
        if(event.type != 'mouseout'){
            restor_array.push(context.getImageData(0,0, canvas.width, canvas.height));
            index += 1;
        }
    }
    
});

// Click the cancel button 
cancelPainting.addEventListener('click', () => {
    paintTools.classList.remove('show');
    downloadPainting.classList.remove('show');

     if(is_drawing){
            context.stroke();
            context.closePath();
            is_drawing = false;
        }
    
});

// Download the Painting
downloadPainting.addEventListener('click', (e) => {
    e.target.href = canvas.toDataURL();
});





// Add a text Box 
function addTextBox(){
    let el = document.createElement("div");
    // var chilenode = document.createElement("p");
     el.textContent = "Add Text";
    // chilenode.appendChild(textNode);
    // el.appendChild(chilenode);
    let idValue = Math.floor(Math.random() * 10000);
    el.classList.add('text-box');
    el.setAttribute('draggable','true');
    el.setAttribute('id',idValue);
    el.setAttribute('contenteditable','true');
    el.setAttribute('ondragstart', 'drag_start(event)',);
    add_tex_tbox.appendChild(el);
}



// Drag Start Function
function drag_start(event) {
    var style = window.getComputedStyle(event.target, null);
    var str = (parseInt(style.getPropertyValue("left")) - event.clientX) + ',' + (parseInt(style.getPropertyValue("top")) - event.clientY) + ',' + event.target.id;
    event.dataTransfer.setData("Text", str);
}
// Dragged Element Drop Function
function drop(event) {
    var offset = event.dataTransfer.getData("Text").split(',');
    var dm = document.getElementById(offset[2]);
    dm.style.left = (event.clientX + parseInt(offset[0], 10)) + 'px';
    dm.style.top = (event.clientY + parseInt(offset[1], 10)) + 'px';
    event.preventDefault();
    return false;
}

// Drag Finish function
function drag_over(event) {
    event.preventDefault();
    return false;
}