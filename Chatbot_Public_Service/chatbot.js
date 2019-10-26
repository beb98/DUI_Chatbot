var Assets = {
    chatbotID : "developoiChatbot",
    chatbotColor : "#2980b9",
    chatbotIconURL : "./robot.png",
    chatbotTheme : "circle",
    chatbotPositionY : "bottom",
    chatbotPositionX : "right",
    chatbotMicrophoneBoolean : false,
    chatbotAnimation : true,
    chatbotTitle : "Chatbot",
    chatbotAvatar : "./chatbotAvatar.png"
}

// Global variables & R-DOM
const parentIFrame = window.parent.document.querySelector(`iframe#${Assets.chatbotID}`);
const currentBody = document.body;
const chatbot_icon = document.querySelector('.chatbot_icon');
const chatbot_chat = document.querySelector('.chatbot_chat');
const chat_title_close = document.querySelector('.chat_title_close');
const chat_body_microphone = document.querySelector('.chat_body_microphone');
const chat_body_close_microphone = document.querySelector('.chat_body_close_microphone');
const loading = document.querySelector('.loading');
const sendMessageInput = document.querySelector('.chat_body_inputC_input');



//////////////////////////////////////////////////////////////////////////////
const giveInstructions = () => {
    console.info("Hi there! , use these attributes to customize your chatbot ")
    console.info(`
    use 
    id="${Assets.chatbotID}" (Static, you should use it)
    
    microphone="boolean (default false)" 
    animation="boolean (default true)"
    color="string (HEX or RGB)"
    company-name="string"
    company-logo="string (valid image URL)"
    theme="string (circle, square)"
    positionY="top, bottom (default bottom)"
    positionX="left, right (default right)"
    icon-url="string (valid icon URL)

    " `)
}


const imageExists = (url, callback) => {
    let img = new Image();
    img.onload = () => { callback(true); };
    img.onerror = () => { callback(false); };
    img.src = url;
}


const getChatbotColor = () => {
    const theme = parentIFrame.getAttribute("color");
    
    const setChatbotColor = (color) => {
        Assets.chatbotColor = color;
    }


    if (typeof theme == "string")
    {
        if (theme.includes('#') && (theme.length == 7 || theme.length == 4))
        {
            setChatbotColor(theme);
        }
        else if (theme.includes("rgb") && theme.includes("(") && theme.includes(")")) 
        {
            setChatbotColor(theme);
        }
        else 
        {
            console.warn('Error in color value , Please use HEX or RGB color to set theme for your chatbot')
        }
    } 
}


const getChatbotIcon = () => {
    const iconURL = parentIFrame.getAttribute('icon-url');
      
    // check if the string in iconURL attr is image
    imageExists(iconURL, (exists) => {
        if (exists == true)
        {
            Assets.chatbotIconURL = iconURL;           
        }

    });

}


const itWasLastCheckStartToDesign = () => {    

    // design chatbot_chat user interface
    designChat();
    // Set internal style
    setInternalDOMStyle();
}


const getChatbotColorAndIcon = () => {
    // get theme attr color
    getChatbotColor();
    // get chatbot icon URL (icon-url attr)
    getChatbotIcon();
    // Check microphone existance
    checkMicrophone();
    // get theme shape
    getThemeShape();  
    // get position 
    getPosition();
    // get company title
    getCompanyTitle();  
    // get company logo
    getCompanyLogo();
    
}


const microphoneEnabled = () => {
    chat_body_microphone.style.display = "none";
    chat_body_close_microphone.style.display = "inline-block";

    loading.style.display = "block";

    var recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || 
                            window.mozSpeechRecognition || window.msSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 5;
    recognition.start();

    recognition.onresult = function(event) {
        let chat_body_inputC_input = document.querySelector('.chat_body_inputC_input');
        chat_body_inputC_input.value = event.results[0][0].transcript;
        chat_body_inputC_input.focus();
        microphoneDisabled();
    };
}


const microphoneDisabled = () => {
    chat_body_close_microphone.style.display = "none";
    chat_body_microphone.style.display = "inline-block";

    loading.style.display = "none"
}


const startToListen = () => {

    chatbot_icon.addEventListener('click' ,() => {
        setIframeOpenedChat();
        let inputElement = document.querySelector('.chat_body_inputC_input');
        inputElement.focus();
    })

    chat_title_close.addEventListener('click' , () => {
        setIframeDefaultStyle();
    })

    if (Assets.chatbotMicrophoneBoolean)
    {
        chat_body_microphone.addEventListener('click' , () => {
            microphoneEnabled();
        })
    
        chat_body_close_microphone.addEventListener('click' , () => {
            microphoneDisabled();  
        })
    }


    sendMessageInput.addEventListener("keypress" , (e) => {
        if (e.keyCode == 13)
        {
            if (e.target.value != "")
            {
                SERVER_CHAT({text : e.target.value , type : "user"});
                e.target.value = "";
            }
        }
    })


}



const setInternalDOMStyle = () => {
    const chatbotIcon = `<img src="${Assets.chatbotIconURL}" style="width: 50%;height : 50%;margin: auto;align-self:center"/>`;
    chatbot_icon.innerHTML = chatbotIcon;

    chatbot_icon.style.background = Assets.chatbotColor

    // body styling
    currentBody.style.background = Assets.chatbotColor;
    currentBody.style.overflow = "hidden";
}



const setShapeAndMessagesSettings = (isShape, shape) => {
            Assets.chatbotTheme = shape.trim();
            
            var messages = document.querySelectorAll('.user_message');
            messages.forEach((message) => {
                isShape ? message.classList.add(`message_${shape.trim()}`) : null;
                message.style.background = Assets.chatbotColor;
            })
    
            Assets.chatbotTheme = shape.trim();
            var messages = document.querySelectorAll('.user_message_ar');
            messages.forEach((message) => {
                isShape ? message.classList.add(`message_${shape.trim()}`) : null;
                message.style.background = Assets.chatbotColor;
            })
    
            var messages = document.querySelectorAll('.robot_message');
            messages.forEach((message) => {
                isShape ? message.classList.add(`message_${shape.trim()}`) : null;
                message.style.color = Assets.chatbotColor;
                message.style.background = "#eee";
                message.style.boxShadow = "0px 3px 12px rgba(0,0,0,0.05)"
            })
    
            var messages = document.querySelectorAll('.robot_message_ar');
            messages.forEach((message) => {
                isShape ? message.classList.add(`message_${shape.trim()}`) : null;
                message.style.color = Assets.chatbotColor;
                message.style.background = "#eee";
                message.style.boxShadow = "0px 3px 12px rgba(0,0,0,0.05)"
            })
}


const getThemeShape = () => {
    const themeShapeTypes = ["circle" , "square" ];
    const shape = parentIFrame.getAttribute('theme')

        if(shape != null)
        {
            if(themeShapeTypes.includes(shape.trim()))
            {
                setShapeAndMessagesSettings(true, shape);
            }   
        }
        else 
        {
            setShapeAndMessagesSettings(false, "");
        }
}



const getPosition = () => {
    const positionsY = ["top" , "bottom"];
    const positionY = parentIFrame.getAttribute('positionY');

    if(positionsY.includes(positionY))
    {

        Assets.chatbotPositionY = positionY.trim();
    }

    const positionsX = ["left" , "right"];
    const positionX = parentIFrame.getAttribute('positionX');

    if(positionsX.includes(positionX))
    {
        Assets.chatbotPositionX = positionX.trim();
    }
}



const checkMicrophone = () => {
    const isMicrophone = parentIFrame.getAttribute("microphone");
    if(isMicrophone == "true")
    {
        Assets.chatbotMicrophoneBoolean = true;
    }
}

const getCompanyLogo = () => {
    const companyLogo = parentIFrame.getAttribute('company-logo');

    imageExists(companyLogo , (existance) => {
        if (existance)
        {
            Assets.chatbotAvatar = companyLogo.trim();
        }
        itWasLastCheckStartToDesign();
    })
}


const getCompanyTitle = () => {
    const companyName = parentIFrame.getAttribute("company-name");

    if(typeof companyName == 'string' && companyName.length > 0)
    {
        Assets.chatbotTitle = companyName;
    }
}


const designChat = () => {
    const chatbotAvatarDOM = document.querySelector(".chat_title_logo");
    chatbotAvatarDOM.src =  Assets.chatbotAvatar;


    const chatbotNameDOM = document.querySelector(".chat_title_name");
    chatbotNameDOM.innerHTML = Assets.chatbotTitle;
}



const setupAnimation = () => {
    const parentIFrameStyle = parentIFrame.style;   
    const animation = parentIFrame.getAttribute('animation');
    animation == "false" ?  parentIFrameStyle.transition = "all 0s" : parentIFrameStyle.transition = "all 0.2s ease-in-out";
}


// Use to open the chat , or to make it opened by default in the init function
const setIframeOpenedChat = () => {
    const parentIFrameStyle = parentIFrame.style;   
    // iframe tag from inside
    parentIFrameStyle.border = "0px";
    parentIFrameStyle.cursor = "pointer";
    parentIFrameStyle.position = "fixed";
    parentIFrameStyle.background = Assets.chatbotColor;
    
    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) 
    {
        parentIFrameStyle.width = "100vw";
        parentIFrameStyle.height = "100vh";
        parentIFrame.style.margin = "0px";
        parentIFrame.style.padding = "0px";
        Assets.chatbotPositionY == "top" ? parentIFrameStyle.top = "0px" : parentIFrameStyle.bottom = "0px";
        Assets.chatbotPositionX == "left" ? parentIFrameStyle.left = "0px" : parentIFrameStyle.right = "0px";
        parentIFrameStyle.borderRadius = Assets.chatbotTheme == "circle" ? "0px" : "0px";    
    }
    else 
    {
        parentIFrameStyle.width = "23vw";
        parentIFrameStyle.height = "70vh";
        Assets.chatbotPositionY == "top" ? parentIFrameStyle.top = "3rem" : parentIFrameStyle.bottom = "3rem";
        Assets.chatbotPositionX == "left" ? parentIFrameStyle.left = "4rem" : parentIFrameStyle.right = "4rem"; 
        parentIFrameStyle.borderRadius = Assets.chatbotTheme == "circle" ? "13px" : "1.5px";   
    }

    parentIFrameStyle.boxShadow = "0px 7px 34px rgba(0,0,0,0.08)"

    setupAnimation();
    chatbot_icon.style.display = "none";
    chatbot_chat.style.display = "block";

    if (Assets.chatbotMicrophoneBoolean)
    {
        chat_body_microphone.style.display = "inline-block";
    }
}



const setIframeDefaultStyle = () => {

      const parentIFrameStyle = parentIFrame.style;   
      // iframe tag from inside
      parentIFrameStyle.border = "0px";
      parentIFrameStyle.cursor = "pointer";
      parentIFrameStyle.position = "fixed";
      Assets.chatbotPositionY == "top" ? parentIFrameStyle.top = "3rem" : parentIFrameStyle.bottom = "3rem";
      Assets.chatbotPositionX == "left" ? parentIFrameStyle.left = "3rem" : parentIFrameStyle.right = "3rem";      parentIFrameStyle.background = Assets.chatbotColor;
      parentIFrameStyle.width = "80px";
      parentIFrameStyle.height = "80px";
      parentIFrameStyle.borderRadius = Assets.chatbotTheme == "circle" ? "50%" : "3px";
      parentIFrameStyle.boxShadow = "0px 7px 34px rgba(0,0,0,0.25)"


      chatbot_icon.style.display = "flex";
      chatbot_chat.style.display = "none";

      chat_body_microphone.style.display = "none";

}



const SERVER_CHAT = async (message) => {
    
    let chat_body_messages_content = document.querySelector('.chat_body_messages_content');
    
    displayChatwithServerData(message);
    loading.style.display = 'block';
    chat_body_messages_content.scrollTop = chat_body_messages_content.scrollHeight;
    
    let response = await fetch(`https://api.dialogflow.com/v1/query?v=20150910&lang=en&query=${message.text}&sessionId=12345&timezone=Egypt/Cairo` , {
        method : "GET",
        headers : {
            'Authorization': `Bearer 8438e355beee4b6db9245a65d85d3317` 
        }
    });

    let robot_response = await response.json();
    robot_response = robot_response.result.fulfillment.speech;
    
    displayChatwithServerData({text : robot_response , type : " "});    
    loading.style.display = 'none';
    chat_body_messages_content.scrollTop = chat_body_messages_content.scrollHeight;
}
 


const displayChatwithServerData = (SEND_TO_SERVER_BODY) => {

    const responseWithMessage = (message) => {
        let chat_body_messages_content = document.querySelector('.chat_body_messages_content');
                
        let classType = message.type == "user" ? Assets.chatbotPositionX == "right" ? "user_message" : "user_message_ar" :
        Assets.chatbotPositionX == "right" ? "robot_message" : "robot_message_ar";

        let templateDiv = document.createElement('div', );
        templateDiv.className = `message ${classType}`;
        templateDiv.innerHTML = message.text;

        chat_body_messages_content.appendChild(templateDiv);


        chat_body_messages_content.scrollTo = chat_body_messages_content.scrollHeight;
        // get theme attr color
        getChatbotColor();
        // get chatbot icon URL (icon-url attr)
        getChatbotIcon();
        // Check microphone existance
        checkMicrophone();
        // get theme shape
        getThemeShape();  
        // get position 
        getPosition();
        // get company title
        getCompanyTitle();  
        // get company logo
        getCompanyLogo();
    }


    if(SEND_TO_SERVER_BODY != "")
    {
        responseWithMessage(SEND_TO_SERVER_BODY)
    }
    
}


// Setup chatbot
const init = () => {
    giveInstructions();
    // Get chatbot color and icon URL
    getChatbotColorAndIcon();    
    // Start to listen to events
    startToListen();
    // Get data and display it 
    displayChatwithServerData('');
    // Set iframe parent style (use config and design)
    setIframeDefaultStyle();
}

init();