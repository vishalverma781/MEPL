import express from "express"
import commontController from "../controller/common/commonFun.js";
import adminCtrl from "../controller/adminController.js";
import authenticateToken from "../middleware/authMiddeleware.js";
// import proejctinchargeController from "../controller/projectInchargeController.js";
// import engineerController from "../controller/SiteEngineerController.js";
// import countController from "../controller/common/countController.js";

const router= express.Router();

//add delete update get Admin
// router.post("/add-admin", commontController.addAdmin );
// router.get("/get-alladmins", commontController.getallAdmins);
// router.put('/update-admin/:username', commontController.updateAdmin)
// router.delete('/delete-admin/:username', commontController.deleteAdmin)
// router.get('/get-allActive-admin', commontController.getallActiveAdmins)

//add project delte project update project
// router.post('/add-project',authenticateToken, adminCtrl.createProject);
// router.put('/update-project/:id', authenticateToken, adminCtrl.updateProject);
// router.get("/get-allproject", authenticateToken, adminCtrl.getProjects);
// router.get("/get-projectsByInchargeId", authenticateToken, adminCtrl.getProjectBYInchargeId);
// router.delete('/delete-project/:id', authenticateToken, adminCtrl.deleteProject);



//for Add delete update get projectIncharge

// router.post("/add-projectIncharge", authenticateToken, adminCtrl.createProjectIncharge );
// router.put("/update-projectIncharge/:id", authenticateToken, adminCtrl.updateProjectIncharge);
// router.get("/get-allprojectIncharge",authenticateToken, adminCtrl.getProjectIncharges)
// router.get('/get-projectInchargeById/:id', authenticateToken, adminCtrl.getProjectInchargeById);
//for add update delete get Plaza
// router.post("/add-plaza", authenticateToken, proejctinchargeController.createPlaza );
// router.put("/update-plaza/:id", authenticateToken, proejctinchargeController.updatePlaza);
// router.get("/get-allplaza", authenticateToken, proejctinchargeController.getPlazas);
// router.get('get-plazaByid/:id', authenticateToken, proejctinchargeController.getPlazaById);
// router.delete('delete-plaza/:id', authenticateToken, proejctinchargeController.deletePlaza);
// router.post("/get-plazaNames", authenticateToken, proejctinchargeController.getPlazaNamesByIds)
// router.get('/get-plazasByProject/:projectId', authenticateToken, proejctinchargeController.getPlazasByprojectId)

//add issue updateIssue delete issue
// router.post("/add-issue", authenticateToken , engineerController.addIssue );
// router.get("/get-allPendingIssues", authenticateToken, engineerController.getAllPendingIssues);
// router.get("/get-allPendingIssuesById", authenticateToken, engineerController.getAllIssuesById)
// router.get('/get-allIssues',authenticateToken, engineerController.getAllIssues);
// router.put("/updateIssue", authenticateToken, adminCtrl.updateIssue)
// router.get("/get-projectIssues/:projectId", authenticateToken, proejctinchargeController.getIssuesByProjectId)
// router.post('/resolve-issue', authenticateToken, adminCtrl.resolveIssue)
// router.get('/get-issuesByPlazaId', authenticateToken, engineerController.getIssuesByPlazaId)




//add siteEngineer , delete ,update 
// router.post("/add-engineer", authenticateToken, adminCtrl.createUser);
// router.get("/get-allSiteEngineers", authenticateToken, proejctinchargeController.getAllUsers);
// router.post("/get-nameById", authenticateToken, proejctinchargeController.getEngineersNamesByIds);
// router.delete("/delete-user/:username", authenticateToken, proejctinchargeController.deleteUser)
// router.put('/update-user/:id', authenticateToken, proejctinchargeController.updateUser)
// router.get('/get-activeEngineers', authenticateToken, proejctinchargeController.getActiveUsers)
// router.get('/allusers', authenticateToken, adminCtrl.getAllusers)
// router.delete('/engineer/:username',authenticateToken,adminCtrl.deleteEngineer);



// router.get("/get-counts", authenticateToken, countController.count)
// router.post("/changeRole", authenticateToken, adminCtrl.changeRoleAndCreateHistory)
export default router;

// console.log("rote file");

// //generate report pdf
// router.get("/report/pdf", authenticateToken, adminCtrl.downloadPdf)