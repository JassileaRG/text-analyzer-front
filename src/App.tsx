import { Button, Modal } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useState } from 'react';

const App = () => {
  const [text, setText] = useState<string>();

  const handleSubmit = (event: any) => {
    event.preventDefault();

    fetch(`http://127.0.0.1:3333/content`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ word: text })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao enviar formulário');
        }
        return response.json();
      })
      .then( response => countDown(response?.isOffensive))
      .catch(error => {
        console.error('error', error);
      });
  };

  const [modal, contextHolder] = Modal.useModal();
  const countDown = (isOffensive: boolean) => {
    let secondsToGo = 5;

    const instance = modal.success({
      title: 'Texto analisado com sucesso!',
      content: isOffensive ? 'O texto possui conteúdo ofensivo!' : 'O texto não possui conteúdo ofensivo.',
    });

    const timer = setInterval(() => {
      secondsToGo -= 1;
    }, 1000);

    setTimeout(() => {
      clearInterval(timer);
      instance.destroy();
    }, secondsToGo * 1000);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="title">Analisador de texto</div>
      <br />
      <TextArea onChange={e => setText(e.target.value)} rows={6} placeholder="Digite seu texto aqui." />
      <br />
      <Button type="primary" htmlType="submit" disabled={!text ? true : false}>Submit</Button>
      {contextHolder}
    </form>
  );
}

export default App;
