module.exports = (base, field) => {

    const events = [
        'change',
        'userChange',
        'fetching',
        'fetchSuccess',
        'fetchError'
    ];

    events.forEach((evt) => {
        field.on(evt, () => {
            base.emit(evt);
        });
    });

};
