const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

const handleDomo = (e, onDomoAdded) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#domoName').value;
    const age = e.target.querySelector('#domoAge').value;
    let food = e.target.querySelector('#domoFood').value;

    //food is set to none if empty
    if (!food) {
        food = "none";
    }

    if (!name || !age) {
        helper.handleError('All fields required');
        return false;
    }

    helper.sendPost(e.target.action, { name, age, food }, onDomoAdded);
    return false;
}

const DomoForm = (props) => {
    return (
        <form id="domoForm"
            onSubmit={(e) => handleDomo(e, props.triggerReload)}
            name="domoForm"
            action="/maker"
            method="POST"
            className="domoForm"
        >
            <label htmlFor="domoName">Name: </label>
            <input id="domoName" type="text" name="name" placeholder="Domo Name" autocomplete="on" />
            <label htmlFor="domoAge">Age: </label>
            <input id="domoAge" type="number" min="0" name="age" placeholder="Domo Age" autocomplete="off" />
            <label htmlFor="domoFood">Fav Food: </label>
            <input id="domoFood" type="text" name="food" placeholder="Domo's Favorite Food" autocomplete="on" />
            <input className="makeDomoSubmit" type="submit" value="Make Domo" />
        </form>
    );
};

const DomoList = (props) => {
    const [domos, setDomos] = useState(props.domos);

    useEffect(() => {
        const loadDomosFromServer = async () => {
            const response = await fetch('/getDomos');
            const data = await response.json();
            setDomos(data.domos);
        };
        loadDomosFromServer();
    }, [props.reloadDomos]);

    if (domos.length === 0) {
        return (
            <div className="domoList">
                <h3 className="emptyDomo">No Domos Yet!</h3>
            </div>
        );
    };

    const domoNodes = domos.map(domo => {
        return (
            <div key={domo.id} className="domo">
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
                <button
                    className="deleteDomoSubmit"
                    onClick={() => helper.deleteDomo(domo._id, props.triggerReload)}>
                    Delete
                </button>
                <div className="info">
                    <h3 className="domoName">Name: {domo.name}</h3>
                    <h3 className="domoAge">Age: {domo.age}</h3>
                    <h3 className="domoFood">Favorite Food: {domo.food}</h3>
                </div>
            </div>
        );
    });

    return (
        <div className="domoList">
            {domoNodes}
        </div>
    );
};

const App = () => {
    const [reloadDomos, setReloadDomos] = useState(false);

    return (
        <div>
            <div id="makeDomo">
                <DomoForm triggerReload={() => setReloadDomos(!reloadDomos)} />
            </div>
            <div id="domos">
                <DomoList domos={[]} reloadDomos={reloadDomos} triggerReload={() => setReloadDomos(!reloadDomos)} />
            </div>
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render(<App />)
};

window.onload = init;