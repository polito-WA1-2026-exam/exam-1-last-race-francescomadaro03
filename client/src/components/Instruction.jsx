import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const Instruction = ({ show, handleClose }) => {
  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton className="bg-dark text-white">
        <Modal.Title>Dossier Agente 7677 - Istruzioni Operative</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        <h5 className="text-danger fw-bold mb-3">Sfondo Operativo</h5>
        <p>
          Anno 2042. Il Governo Centrale ha imposto il controllo totale sulle comunicazioni. 
          Rete internet oscurata, linee telefoniche intercettate e ogni frequenza radio tracciata dai droni di sorveglianza. 
          La <strong>Resistenza</strong>, in lotta da un decennio per ripristinare la libertà, è stata costretta a tornare al passato: l'unica via sicura per scambiarsi informazioni vitali è la consegna <em>brevi manu</em> all'ombra dei lunghi e bui tunnel sotterranei della metropolitana.
        </p>
        <p>
          Tu sei l'<strong>Agente 7677</strong>, l'ultima matricola appena reclutata. 
          Il tuo compito è vitale: devi spostarti agilmente per la città per consegnare i messaggi segreti tra i vari avamposti. 
          Sul campo non avrai dispositivi digitali o mappe interattive ad aiutarti per non farti tracciare; la tua unica vera arma di sopravvivenza sarà la tua <strong>memoria</strong> e la conoscenza della rete metropolitana.
        </p>

        <hr className="my-4" />

        <h5 className="text-primary fw-bold mb-3">Come si gioca</h5>
        <ul className="mb-4">
          <li className="mb-2">All'inizio della missione ti verranno assegnate una stazione di <strong>Partenza</strong> e una stazione di <strong>Arrivo</strong>.</li>
          <li className="mb-2">Dovrai ricostruire l'intero percorso selezionando in ordine cronologico le fermate intermedie corrette.</li>
          <li className="mb-2">Fai molta attenzione agli <strong>snodi di interscambio</strong> se devi saltare da una linea all'altra!</li>
          <li className="mb-2">Premi Conferma solo quando sei assolutamente certo del percorso. Se commetti un errore, verrai intercettato dal Governo e la missione fallirà.</li>
        </ul>
        <div className="alert alert-warning border-start border-warning border-4" role="alert">
          <em>Ricorda: la sopravvivenza della Resistenza è nelle tue mani. Sii rapido e invisibile.</em>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Chiudi Dossier
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Instruction;
