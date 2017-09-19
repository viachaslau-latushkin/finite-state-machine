class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        if(!config)
            throw new Error("Error thrown: config not passed");
        else{
			var con = config.initial;
			this.conf = {};
			this.conf.initial = con;
            this.errorState = false;
            this.stateHistoryUndo = [];
            this.stateHistoryRedo = [];
            this.stateHistoryUndo.push(this.conf.initial);
            this.stateHistoryRedo.push(this.conf.initial);
        }
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this.conf.initial;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        var states = ["normal", "busy", "hungry", "sleeping"];
        if(states.indexOf(state) == -1)
            throw new Error("Error thrown: state not exist");
        else{
            this.conf.initial = state;
            this.stateHistoryUndo.push(state);

            var disable = this.stateHistoryRedo[0];
            this.stateHistoryRedo = [];
            this.stateHistoryRedo[0] = disable;
        }
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        var events = {
            'get_tired': 'sleeping',
            'get_hungry': 'hungry',
            'get_up': 'normal',
            'study': 'busy',
            'eat': 'normal'
        }
        if(events[event] === undefined || this.errorState){
            this.errorState = true;
            throw new Error("Error thrown: event not exist");
        }    
        else{
            this.stateHistoryUndo.push(events[event]);
            this.conf.initial = events[event];

            var disable = this.stateHistoryRedo[0];
            this.stateHistoryRedo = [];
            this.stateHistoryRedo[0] = disable;
        }
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.conf.initial = 'normal';
        return this;
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        var events = {
            'get_tired':['sleeping'],
            'get_hungry':['busy','sleeping'],
            'get_up':['normal'],
            'eat':['normal'],
            'study':['normal'],
        }

        var states = ['normal', 'busy', 'hungry', 'sleeping'];
        if(event === undefined)  
            return states;
        else if(events[event] === undefined)  
            return [];
        else
            return events[event];
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if(this.stateHistoryUndo.length == 1)
            return false;
        else{
            if(this.stateHistoryUndo.length != 1){
                var redo = this.stateHistoryUndo.pop();
                this.stateHistoryRedo.push(redo);
				this.conf.initial = this.stateHistoryUndo[this.stateHistoryUndo.length-1];
				return true;
            }
        }
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if(this.stateHistoryRedo.length == 1)
            return false;
        else{
            if(this.stateHistoryRedo != 1){
                var undo = this.stateHistoryRedo.pop();
				this.stateHistoryUndo.push(undo);
				this.conf.initial = undo;
				return true;
            }
        }
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        var disable = this.stateHistoryUndo[0];
        this.stateHistoryUndo = [];
        this.stateHistoryUndo[0] = disable;

        var disable = this.stateHistoryRedo[0];
        this.stateHistoryRedo = [];
        this.stateHistoryRedo[0] = disable;

        return this;
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
