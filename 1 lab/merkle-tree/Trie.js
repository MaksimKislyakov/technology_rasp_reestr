/**
 * Seminar 2.5 Simple Trie
 */


class TrieNode {
    constructor(key) {
        this.key = key;
        this.children = {};
        this.isWord = false;
    }
}


class Trie {
    constructor() {
        this.root = new TrieNode(null);
    }

    insert(word) {
        let currentNode = this.root;
        
        for (let i = 0; i < word.length; i++) {
            const char = word[i];
            
            if (!currentNode.children[char]) {
                currentNode.children[char] = new TrieNode(char);
            }
            
            currentNode = currentNode.children[char];
        }
        
        currentNode.isWord = true;
    }

    hasNode(word) {
        let currentNode = this.root;
        
        for (let i = 0; i < word.length; i++) {
            const char = word[i];
            
            if (!currentNode.children[char]) {
                return false;
            }
            
            currentNode = currentNode.children[char];
        }
        
        return currentNode.isWord;
    }

    getAllNodes() {
        const nodes = [];
        
        function traverse(node) {
            nodes.push(node);
            for (const key in node.children) {
                traverse(node.children[key]);
            }
        }
        
        traverse(this.root);
        return nodes;
    }
}

module.exports = { Trie };
