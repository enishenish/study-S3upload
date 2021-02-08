import { useState } from 'react';
import './App.css';

import Amplify, {Storage} from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import awsmobile from './aws-exports';

Amplify.configure(awsmobile)


function App() {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const downloadUrl = async () => {
    const downloadUrl = await Storage.get('picture.jpg', { level: 'private', expires: 300});
    window.location.href = downloadUrl;
  }

  const handleChange = async (e) => {
    const file = e.target.files[0];

    try {
      setLoading(true);
      await Storage.put('picture.jpg', file, {
        level: 'private',
        contentType: 'image/jpg'
      });
      const url = await Storage.get('picture.jpg', { level: 'private'})
      setImageUrl(url);
      setLoading(false);
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="App">
      <h1> Upload an Image </h1>
      {loading ? <h3>Uploading...</h3> : 
        <input
          type="file"
          accept="image/jpg"
          onChange={(event) => handleChange(event)} />
      }
      <div> 
        {imageUrl ? <img style={{ width: "240px"}} src={imageUrl} /> : <span />}
      </div>
      <div>
        <h2> Download Url ?</h2>
        <button onClick={() => downloadUrl()}>Click Here!</button>
      </div>
    </div>
  );
}

export default withAuthenticator(App);
