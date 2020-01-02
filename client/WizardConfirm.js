import React from "react";
import Table from "./Table";
import { ButtonModal } from "@kth/kth-style-react-components";

function WizardConfirm({
  setCurrentPage,
  selectedAssignment,
  selectedModule,
  examinationDate,
  courseId
}) {
  const showTable = selectedAssignment && selectedModule;

  const tableFooter = (
    <div className="button-section">
      <button
        type="button"
        className="btn btn-secondary grid-col-1"
        onClick={event => setCurrentPage(1)}
      >
        ← Assignments
      </button>
      <button
        type="button"
        className="btn btn-secondary grid-col-2"
        onClick={event => setCurrentPage(0)}
      >
        Cancel
      </button>
      <ButtonModal
        id="export"
        type="submit"
        btnLabel="Export to Ladok"
        handleParentConfirm={() => {
          setCurrentPage(3);
        }}
        modalLabels={{
          header: "Confirm export",
          body: `<br>Canvas assignment: <strong>${selectedAssignment.name}</strong><br>Ladok module: <strong>${selectedModule.name}</strong><br>Date: <strong>${examinationDate}</strong><br><br>Do you want to proceed?`,
          btnCancel: "No, go back",
          btnConfirm: "Yes, export"
        }}
        className="grid-col-3"
        disabled={false}
      />
    </div>
  );

  return (
    <form method="post">
      <h2>Export students with results (Step 2 of 2)</h2>
      <div className="alert alert-info" aria-live="polite" role="alert">
        <p>
          Note that the results of students are based on data fetched from
          Canvas Gradebook during launch of this application. If you have
          entered a result very recently and it is missing, you might have to
          relaunch the application.
        </p>
      </div>
      {showTable && (
        <div>
          <Table
            course={courseId}
            assignment={selectedAssignment}
            module={selectedModule}
            date={examinationDate}
          />
          {tableFooter}
        </div>
      )}
    </form>
  );
}

export default WizardConfirm;
