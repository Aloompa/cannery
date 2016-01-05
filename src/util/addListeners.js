module.exports = (base, field) => {

    const events = [
        'change',
        'userChange',
        'fetching',
        'fetchSuccess',
        'fetchError'
    ];

    events.forEach((evt) => {
        if (!field.on) {
            return;
        }

        field.on(evt, () => {
            base.emit(evt);
        });
    });
    
};
