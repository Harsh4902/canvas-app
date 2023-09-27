import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer';
import './App.css'; // Import your CSS file

function App() {
  const [classes, setClasses] = useState(new Map());
  const [filteredClasses, setFilteredClasses] = useState(new Map());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState({
    className: '',
    classContent: '',
    changedClassContent: '',
  });

  useEffect(() => {
    axios
      .get('https://canvas-back.onrender.com/api/classes')
      .then((response) => {
        const classesMap = new Map(response.data.classes);
        setClasses(classesMap);
        setFilteredClasses(classesMap);
      })
      .catch((error) => console.log(error));
  }, []);

  const selectClass = (event) => {
    const className = event.target.className;
    setSelectedClass({
      className: className,
      classContent: classes.get(className),
      changedClassContent: '',
    });
  };

  const handleSave = () => {
    axios
      .post('https://canvas-back.onrender.com/api/home', selectedClass)
      .then((response) => {
        setSelectedClass({
          className: response.data.className,
          classContent: response.data.classContent,
          changedClassContent: response.data.changedClassContent,
        });
      })
      .catch((error) => console.log(error));
  };

  const handleDeploy = () => {
    axios
      .post('https://canvas-back.onrender.com/api/save', selectedClass)
      .then((response) => {
        console.log('response' + response);
      })
      .catch((error) => console.log(error));
  };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = new Map([...classes].filter(([className]) => className.toLowerCase().includes(query)));
    setFilteredClasses(filtered);
  };

  const newStyles = {
    variables: {
      light: {
        codeFoldGutterBackground: '#6F767E',
        codeFoldBackground: '#E2E4E5',
      },
    },
  };

  return (
    <div className='all'>
    <div className='header'>
      <h1>Canvas App</h1>
    </div>
    <div className="container">
      <div className="left-panel">
        <h1>Classes</h1>
        <input
          type="text"
          placeholder="Search classes"
          value={searchQuery}
          onChange={handleSearch}
        />
        <div className="class-list">
          {[...filteredClasses.keys()].map((className) => (
            <div key={className}>
              <p className={className} onClick={selectClass}>
                {className}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="right-panel">
        <h1>Class Content</h1>
        {selectedClass.className !== '' ? (
          <div className="class-content">
            {selectedClass.changedClassContent !== '' ? (
              <ReactDiffViewer
                oldValue={selectedClass.classContent}
                newValue={selectedClass.changedClassContent}
                splitView={true}
                compareMethod={DiffMethod.WORDS}
                styles={newStyles}
                leftTitle="Version A"
                rightTitle="Version B"
              />
            ) : (
              <div className="classContent">{selectedClass.classContent}</div>
            )}
            <div className="buttons">
              <button onClick={handleSave}>Save</button>
              <button onClick={handleDeploy}>Deploy Changes</button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
    </div>
  );
}

export default App;
