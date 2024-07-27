package next.school.cesar.projeto_m3.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import next.school.cesar.projeto_m3.dtos.EquipeDTO;
import next.school.cesar.projeto_m3.dtos.UsuarioDTO;
import next.school.cesar.projeto_m3.entities.Equipe;
import next.school.cesar.projeto_m3.entities.Usuario;
import next.school.cesar.projeto_m3.repositories.EquipeRepository;
import next.school.cesar.projeto_m3.repositories.UsuarioRepository;

@Service
public class EquipeService {

    @Autowired
    private EquipeRepository equipeRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<EquipeDTO> getAllEquipes() {
        return equipeRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public EquipeDTO getEquipeById(Long id) {
        Equipe equipe = equipeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Equipe não encontrada"));
        return convertToDTO(equipe);
    }

    public EquipeDTO createEquipe(EquipeDTO equipeDTO) {
        validarEquipeDTO(equipeDTO);

        List<Usuario> usuarios = usuarioRepository.findByMatriculaIn(equipeDTO.getUsuarioMatriculas());
        if (usuarios.size() != equipeDTO.getUsuarioMatriculas().size()) {
            throw new RuntimeException("Um ou mais usuários não foram encontrados");
        }

        Equipe equipe = Equipe.builder()
                .nome(equipeDTO.getNome())
                .descricao(equipeDTO.getDescricao())
                .usuarios(usuarios)
                .build();
        equipe = equipeRepository.save(equipe);
        return convertToDTO(equipe);
    }

    public EquipeDTO updateEquipe(Long id, EquipeDTO equipeDTO) {
        validarEquipeDTO(equipeDTO);

        Equipe equipe = equipeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Equipe não encontrada"));

        equipe.setNome(equipeDTO.getNome());
        equipe.setDescricao(equipeDTO.getDescricao());

        if (equipeDTO.getUsuarioMatriculas() != null) {
            List<Usuario> usuarios = usuarioRepository.findByMatriculaIn(equipeDTO.getUsuarioMatriculas());
            if (usuarios.isEmpty()) {
                throw new RuntimeException("Usuários não encontrados");
            }
            equipe.setUsuarios(usuarios);
        }

        equipe = equipeRepository.save(equipe);
        return convertToDTO(equipe);
    }

    public boolean deleteEquipe(Long id) {
        if (equipeRepository.existsById(id)) {
            equipeRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public EquipeDTO addUsuariosToEquipe(Long equipeId, List<String> usuarioMatriculas) {
        Equipe equipe = equipeRepository.findById(equipeId)
                .orElseThrow(() -> new RuntimeException("Equipe não encontrada"));

        List<Usuario> usuarios = usuarioRepository.findByMatriculaIn(usuarioMatriculas);

        if (usuarios.isEmpty()) {
            throw new RuntimeException("Usuários não encontrados");
        }

        equipe.getUsuarios().addAll(usuarios);

        equipe = equipeRepository.save(equipe);
        return convertToDTO(equipe);
    }

    private EquipeDTO convertToDTO(Equipe equipe) {
        List<UsuarioDTO> usuarios = equipe.getUsuarios().stream()
                .map(usuario -> UsuarioDTO.builder()
                        .matricula(usuario.getMatricula())
                        .nome(usuario.getNome())
                        .email(usuario.getEmail())
                        .centroCusto(usuario.getCentroCusto())
                        .statusUsuario(usuario.isStatusUsuario())
                        .statusUsuarioDescricao(usuario.getStatusUsuarioDescricao())
                        .build())
                .collect(Collectors.toList());

        return EquipeDTO.builder()
                .idEquipe(equipe.getIdEquipe())
                .nome(equipe.getNome())
                .descricao(equipe.getDescricao())
                .usuarios(usuarios)
                .build();
    }

    private void validarEquipeDTO(EquipeDTO equipeDTO) {
        if (equipeDTO.getNome() == null || equipeDTO.getNome().trim().isEmpty()) {
            throw new RuntimeException("Nome da equipe não pode ser nulo ou vazio");
        }
        if (equipeDTO.getDescricao() == null || equipeDTO.getDescricao().trim().isEmpty()) {
            throw new RuntimeException("Descrição da equipe não pode ser nula ou vazia");
        }
        if (equipeDTO.getUsuarioMatriculas() == null || equipeDTO.getUsuarioMatriculas().isEmpty()) {
            throw new RuntimeException("Lista de matrículas de usuários não pode ser nula ou vazia");
        }
    }
}
