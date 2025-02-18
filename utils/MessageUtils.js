const messageReply = (recipient, input) => {
    let data;
  
    if (input === 'test2') {
      data = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: recipient,  // Replace with actual recipient number
        type: 'template',
        template: {
          name: 'r_default',
          language: { code: 'en_US' },
          components: [{
            type: 'body',
            parameters: [
              { type: 'text', text: '8003074521' },
              { type: 'text', text: 'https://stockedge.com/' }
            ]
          }]
        }
      };
    }
    else if(input === 'test'){
      data = {
        "messaging_product": "whatsapp",
        "to": recipient,
        "type": "template",
        "template": {
          "name": "hello_world",
          "language": { "code": "en_US" }
        }
      };
    }
    else {
      data = {
        messaging_product: 'whatsapp',
        to: recipient,
        type: 'template',
        template: { name: 'r_test_2', language: { code: 'en_US' } }
      };
    }
  
    return JSON.stringify(data);
  };
  export default messageReply;