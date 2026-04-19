/**
 * Seminar 2.3 Binary search tree
 */

class Node {
    constructor(data) {
        this.data = data;
        this.left = null;
        this.right = null;
    }
}


class Tree {
    constructor() {
        this.root = null;
    }

    addNode(node) {
        if (this.root === null) {
            this.root = node;
            return;
        }
        
        this._addNode(this.root, node);
    }
    
    _addNode(current, newNode) {
        if (newNode.data < current.data) {
            if (current.left === null) {
                current.left = newNode;
            } else {
                this._addNode(current.left, newNode);
            }
        } 
        else if (newNode.data > current.data) {
            if (current.right === null) {
                current.right = newNode;
            } else {
                this._addNode(current.right, newNode);
            }
        }
    }

    hasNode(data) {
        return this._hasNode(this.root, data);
    }
    
    _hasNode(current, data) {
        if (current === null) {
            return false;
        }
        
        if (data === current.data) {
            return true;
        }
        
        if (data < current.data) {
            return this._hasNode(current.left, data);
        } else {
            return this._hasNode(current.right, data);
        }
    }
}



module.exports = { Node, Tree }
