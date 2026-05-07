pragma solidity >=0.8.0 <0.9.0;

contract CertificateRegistry {
    address public admin;

    struct Certificate {
        string studentName;
        string courseName;
        uint256 issueDate;
        bool isIssued;
    }

    mapping(uint256 => Certificate) public certificates;

    event CertificateIssued(uint256 indexed certId, string studentName, string courseName);

    constructor() {
        admin = msg.sender;
    }

    function issueCertificate(uint256 _certId, string memory _studentName, string memory _courseName) public {
        require(msg.sender == admin, "Only admin can issue certificates");
        require(!certificates[_certId].isIssued, "Certificate already exists");

        certificates[_certId] = Certificate({
            studentName: _studentName,
            courseName: _courseName,
            issueDate: block.timestamp,
            isIssued: true
        });

        emit CertificateIssued(_certId, _studentName, _courseName);
    }

    function verifyCertificate(uint256 _certId) public view returns (string memory studentName, string memory courseName, uint256 issueDate, bool isIssued) {
        Certificate memory cert = certificates[_certId];
        return (cert.studentName, cert.courseName, cert.issueDate, cert.isIssued);
    }
}