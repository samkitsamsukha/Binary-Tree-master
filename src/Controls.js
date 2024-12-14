/***
 * Controls.js
 *
 * This file defines the Controls class, updated to use a modal for user input
 * instead of alert or prompt popups for better UI/UX.
***/
class Controls {
    // Using the static keyword to define readable class constants

    // Constants for the ids of various user interface elements
    static CLEARID = "clear-btn";
    static QUICKFILLID = "quick-fill-btn";
    static SLOWFILLID = "slow-fill-btn";
    static ADDID = "add-btn";
    static SEARCHID = "search-btn";
    static SLIDERID = "speed-slider";

    static MODALID = "modal";
    static MODALINPUTID = "modal-input";
    static MODALCANCELID = "modal-cancel";
    static MODALSUBMITID = "modal-submit";

    static NODELIMIT = 500;

    constructor(tree) {
        this.tree = tree;
        this.tree.bindControls(this); // Provide the tree a reference to this class

        this.animationInterval = null; // Property Tree class relies on for animation

        // Store all of the user interface elements based on the IDs
        this.clearBtn = document.getElementById(Controls.CLEARID);
        this.quickFillBtn = document.getElementById(Controls.QUICKFILLID);
        this.slowFillBtn = document.getElementById(Controls.SLOWFILLID);
        this.addBtn = document.getElementById(Controls.ADDID);
        this.searchBtn = document.getElementById(Controls.SEARCHID);
        this.speedSlider = document.getElementById(Controls.SLIDERID);

        this.modal = document.getElementById(Controls.MODALID);
        this.modalInput = document.getElementById(Controls.MODALINPUTID);
        this.modalCancel = document.getElementById(Controls.MODALCANCELID);
        this.modalSubmit = document.getElementById(Controls.MODALSUBMITID);

        this.resolveModal = null; // Used to resolve promises for modal input

        // Set the animation interval based on the slider's value
        this.setAnimationSpeed();

        // Append event listeners to run each animation
        this.clearBtn.addEventListener('click', () => this.triggerAnimation(this.clear));
        this.quickFillBtn.addEventListener('click', () => this.triggerAnimation(this.quickFill));
        this.slowFillBtn.addEventListener('click', () => this.triggerAnimation(this.slowFill));
        this.addBtn.addEventListener('click', () => this.triggerAnimation(this.add));
        this.searchBtn.addEventListener('click', () => this.triggerAnimation(this.search));

        // Append an event listener to change the animation interval
        this.speedSlider.addEventListener('input', this.setAnimationSpeed.bind(this));

        // Event listeners for modal buttons
        this.modalCancel.addEventListener('click', () => this.closeModal(null));
        this.modalSubmit.addEventListener('click', () => this.submitModal());

        
    }

    // Completely resets the tree, removing all nodes, stopping all animations
    clear() {
        this.tree.clear();
        this.tree.stopAnimation(() => {});
        this.tree.draw();
    }

    // Called by event listeners to run a certain animation if one is not running
    triggerAnimation(animation) {
        if (this.tree.running) {
            alert('Please wait for the current animation to finish');
        } else {
            animation.bind(this)();
        }
    }

    // Prompts the user with a modal for input
    // Returns: a Promise that resolves with the user input (string), or null if canceled
    getNumber(message) {
        return new Promise((resolve) => {
            document.getElementById("modal-message").textContent = message;
            this.modalInput.value = "";
            this.modal.classList.remove("hidden");
            this.resolveModal = resolve;
        });
    }

    // Closes the modal and resolves the promise with the given value
    closeModal(value) {
        this.modal.classList.add("hidden");
        this.resolveModal(value);
    }

    // Handles modal submit button click
    submitModal() {
        const value = this.modalInput.value.trim();
        if (value === "" || isNaN(parseInt(value)) || parseInt(value) < 0) {
            alert('Please enter a valid positive integer');
        } else {
            this.closeModal(parseInt(value));
        }
    }

    // Method for the Quick Fill animation
    async quickFill() {
        const count = await this.getNumber("Number of nodes:");

        if (count !== null && (count < Controls.NODELIMIT ||
                confirm(count + ' nodes may reduce performance. Continue anyways?'))) {
            this.tree.fill(count);
        }
    }

    // Method for the Fill animation
    async slowFill() {
        const count = await this.getNumber("Number of nodes:");

        if (count !== null && (count < Controls.NODELIMIT ||
                confirm(count + ' nodes may reduce performance. Continue anyways?'))) {
            this.tree.fillVisual(count);
        }
    }

    // Method for the Add animation
    async add() {
        const value = await this.getNumber("Value to add:");

        if (value !== null && this.tree.search(value)) {
            alert(value + ' is already in the tree');
        } else if (value !== null) {
            this.tree.addValueVisual(value);
        }
    }

    // Method for the search animation
    async search() {
        const value = await this.getNumber("Value to search for:");

        if (value !== null) {
            this.tree.searchVisual(value);
        }
    }

    // Inverts and exponentiates the linear output of the slider to set the interval
    setAnimationSpeed() {
        this.animationInterval = 1000 / Math.pow(10, this.speedSlider.value);
    }

    preOrder() {
        this.tree.preOrderVisual();
    }

    // In-order traversal
    inOrder() {
        this.tree.inOrderVisual();
    }

    // Post-order traversal
    postOrder() {
        this.tree.postOrderVisual();
    }
}
