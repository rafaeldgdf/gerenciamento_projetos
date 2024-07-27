package next.school.cesar.projeto_m3.controllers;

import next.school.cesar.projeto_m3.dtos.EquipeDTO;
import next.school.cesar.projeto_m3.services.EquipeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/equipes")
public class EquipeController {

    @Autowired
    private EquipeService equipeService;

    @GetMapping
    public List<EquipeDTO> getAllEquipes() {
        return equipeService.getAllEquipes();
    }

    @GetMapping("/{id}")
    public ResponseEntity<EquipeDTO> getEquipeById(@PathVariable Long id) {
        EquipeDTO equipeDTO = equipeService.getEquipeById(id);
        return equipeDTO != null ? ResponseEntity.ok(equipeDTO) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<EquipeDTO> createEquipe(@RequestBody EquipeDTO equipeDTO) {
        EquipeDTO equipe = equipeService.createEquipe(equipeDTO);
        return ResponseEntity.status(201).body(equipe);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EquipeDTO> updateEquipe(@PathVariable Long id, @RequestBody EquipeDTO equipeDTO) {
        EquipeDTO equipe = equipeService.updateEquipe(id, equipeDTO);
        return equipe != null ? ResponseEntity.ok(equipe) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEquipe(@PathVariable Long id) {
        boolean deleted = equipeService.deleteEquipe(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    @PostMapping("/{id}/usuarios")
    public ResponseEntity<EquipeDTO> addUsuariosToEquipe(@PathVariable Long id, @RequestBody List<String> usuarioMatriculas) {
        EquipeDTO equipe = equipeService.addUsuariosToEquipe(id, usuarioMatriculas);
        return ResponseEntity.ok(equipe);
    }
}
