package next.school.cesar.projeto_m3.controllers;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import next.school.cesar.projeto_m3.dtos.ProjetoDTO;
import next.school.cesar.projeto_m3.entities.Projeto;
import next.school.cesar.projeto_m3.services.ProjetoService;

import javax.swing.event.ListSelectionEvent;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/projetos")
public class ProjetoController {

    @Autowired
    private ProjetoService projetoService;
    
    @GetMapping("/procurar")
    public ResponseEntity<List<ProjetoDTO>> getProjetosByCriteria(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String gerenteMatricula,
            @RequestParam(required = false) String nome,
            @RequestParam(required = false) String centroCusto,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") Date dtInicio,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") Date dtTerminoPrevista,
            @RequestParam(required = false) Integer mesInicio,
            @RequestParam(required = false) Integer anoInicio,
            @RequestParam(required = false) Integer mesTermino,
            @RequestParam(required = false) Integer anoTermino,
            @RequestParam(required = false) Double orcamento,
            @RequestParam(required = false) String flags,
            @RequestParam(required = false) String matricula,
            @RequestParam(required = false) String descricao) {
        
        List<ProjetoDTO> projetos = projetoService.getProjetosByCriteria(status, gerenteMatricula, nome, centroCusto, dtInicio, dtTerminoPrevista, mesInicio, anoInicio, mesTermino, anoTermino, orcamento, flags, matricula, descricao);
        return ResponseEntity.ok(projetos);
    }

    
    @GetMapping
    public List<ProjetoDTO> getAllProjetos() {
        return projetoService.getAllProjetos();
    }


    @GetMapping("/{id}")
    public ResponseEntity<ProjetoDTO> getProjetoById(@PathVariable Long id) {
        ProjetoDTO projetoDTO = projetoService.getProjetoById(id);
        return projetoDTO != null ? ResponseEntity.ok(projetoDTO) : ResponseEntity.notFound().build();
    }

    @GetMapping("/matricula/{matricula}")
    public ProjetoDTO getProjetoByMatricula(@PathVariable String matricula) {
        return projetoService.getProjetoByMatricula(matricula);
    }
    
    @GetMapping("/status")
    public List<Projeto> getProjetosByStatusProjeto(@RequestParam String status) {
        return projetoService.getProjetosByStatusProjeto(status);
    }    
    
    @PostMapping
    public ResponseEntity<ProjetoDTO> createProjeto(@RequestBody ProjetoDTO projetoDTO) {
        ProjetoDTO createdProjeto = projetoService.createProjeto(projetoDTO);
        return ResponseEntity.status(201).body(createdProjeto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjetoDTO> updateProjeto(@PathVariable Long id, @RequestBody ProjetoDTO projetoDTO) {
        ProjetoDTO updatedProjeto = projetoService.updateProjeto(id, projetoDTO);
        return updatedProjeto != null ? ResponseEntity.ok(updatedProjeto) : ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProjeto(@PathVariable Long id) {
        boolean deleted = projetoService.deleteProjeto(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
    
}
