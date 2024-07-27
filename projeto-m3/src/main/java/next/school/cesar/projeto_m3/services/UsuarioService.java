package next.school.cesar.projeto_m3.services;

import java.time.LocalDate;
import java.time.Period;
import java.time.ZoneId;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import next.school.cesar.projeto_m3.dtos.UsuarioDTO;
import next.school.cesar.projeto_m3.entities.Usuario;
import next.school.cesar.projeto_m3.repositories.UsuarioRepository;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    public Usuario createUsuario(UsuarioDTO usuarioDTO) {
        validarUsuarioDTO(usuarioDTO, null);
        
        Usuario usuario = Usuario.builder()
                .nome(usuarioDTO.getNome())
                .ultimoNome(usuarioDTO.getUltimoNome())
                .centroCusto(usuarioDTO.getCentroCusto().toLowerCase())
                .dtNascimento(usuarioDTO.getDtNascimento())
                .statusUsuario(usuarioDTO.isStatusUsuario())
                .email(usuarioDTO.getEmail())
                .matricula(generateMatricula(usuarioDTO.getCentroCusto().toLowerCase()))
                .build();
        usuario.setStatusUsuario(usuarioDTO.isStatusUsuario());
        String status = alterarStatus(usuarioDTO.isStatusUsuario());
        usuario.setStatusUsuarioDescricao(status);
        return usuarioRepository.save(usuario);
    }

    private String generateMatricula(String centroCusto) {
        int anoAtual = java.time.Year.now().getValue();
        long contador = usuarioRepository.countByCentroCusto(centroCusto) + 1;
        String matricula;

        do {
            matricula = String.format("%d%04d", anoAtual % 100, contador);
            contador++;
        } while (usuarioRepository.existsByMatricula(matricula));
        return matricula;
    }

    public List<Usuario> getAllUsuarios() {
        return usuarioRepository.findAll();
    }

    public Usuario getUsuarioById(Long id) {
        return usuarioRepository.findById(id).orElse(null);
    }

    public UsuarioDTO getUsuarioByMatricula(String matricula) {
        Usuario usuario = usuarioRepository.findByMatricula(matricula)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        return convertToDTO(usuario);
    }

    public List<Usuario> getUsuariosByStatusDescricao(String statusUsuarioDescricao) {
        if (!isValidStatus(statusUsuarioDescricao)) {
            throw new IllegalArgumentException("Status Inválido " + statusUsuarioDescricao);
        }
        return usuarioRepository.findByStatusUsuarioDescricao(statusUsuarioDescricao);
    }

    public Usuario updateUsuario(Long id, UsuarioDTO usuarioDTO) {
        validarUsuarioDTO(usuarioDTO, id);
        
        Usuario usuario = getUsuarioById(id);
        if (usuario != null) {
            usuario.setNome(usuarioDTO.getNome());
            usuario.setUltimoNome(usuarioDTO.getUltimoNome());
            usuario.setDtNascimento(usuarioDTO.getDtNascimento());
            usuario.setEmail(usuarioDTO.getEmail());
            usuario.setCentroCusto(usuarioDTO.getCentroCusto().toLowerCase());
            usuario.setStatusUsuario(usuarioDTO.isStatusUsuario());
            String status = alterarStatus(usuarioDTO.isStatusUsuario());
            usuario.setStatusUsuarioDescricao(status);
            return usuarioRepository.save(usuario);
        }
        return null;
    }

    public boolean deleteUsuario(Long id) {
        if (usuarioRepository.existsById(id)) {
            usuarioRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public String alterarStatus(boolean statusUsuario) {
        return statusUsuario ? "Ativo" : "Inativo";
    }

    private UsuarioDTO convertToDTO(Usuario usuario) {
        return UsuarioDTO.builder()
                .matricula(usuario.getMatricula())
                .nome(usuario.getNome())
                .ultimoNome(usuario.getUltimoNome())
                .email(usuario.getEmail())
                .centroCusto(usuario.getCentroCusto())
                .dtNascimento(usuario.getDtNascimento())
                .statusUsuarioDescricao(usuario.getStatusUsuarioDescricao())
                .statusUsuario(usuario.isStatusUsuario())
                .build();
    }

    private boolean isValidStatus(String status) {
        return "Ativo".equalsIgnoreCase(status) || "Inativo".equalsIgnoreCase(status);
    }

    private void validarUsuarioDTO(UsuarioDTO usuarioDTO, Long id) {
    	validarCamposObrigatorios(usuarioDTO);
        LocalDate dataNascimento = usuarioDTO.getDtNascimento().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        LocalDate hoje = LocalDate.now();
        if (Period.between(dataNascimento, hoje).getYears() < 18) {
            throw new RuntimeException("Usuário deve ter pelo menos 18 anos de idade");
        }
        validarCentroCusto(usuarioDTO.getCentroCusto().toLowerCase());
        verificarEmailUnico(usuarioDTO.getEmail(), id);
    }

    private void validarCentroCusto(String centroCusto) {
        List<String> validCentrosCusto = Arrays.asList(
            "desenvolvimento", "arquitetura", "engenharia", "operação", 
            "design", "projeto", "dados", "financeiro", "ti", "rh"
        );

        if (!validCentrosCusto.contains(centroCusto.toLowerCase())) {
            throw new RuntimeException("Centro de custo inválido. Válidos: " + String.join(", ", validCentrosCusto));
        }
    }

    private void verificarEmailUnico(String email, Long id) {
        Usuario usuarioExistente = usuarioRepository.findByEmail(email).orElse(null);
        if (usuarioExistente != null && (id == null || !usuarioExistente.getIdUsuario().equals(id))) {
            throw new RuntimeException("Email já está em uso: " + email);
        }
    }
    
    private void validarCamposObrigatorios(UsuarioDTO usuarioDTO) {
        if (usuarioDTO.getNome() == null || usuarioDTO.getNome().trim().isEmpty()) {
            throw new RuntimeException("Nome não pode ser nulo ou vazio");
        }
        if (usuarioDTO.getUltimoNome() == null || usuarioDTO.getUltimoNome().trim().isEmpty()) {
            throw new RuntimeException("Último nome não pode ser nulo ou vazio");
        }
        if (usuarioDTO.getDtNascimento() == null) {
            throw new RuntimeException("Data de nascimento não pode ser nula");
        }
        if (usuarioDTO.getEmail() == null || usuarioDTO.getEmail().trim().isEmpty()) {
            throw new RuntimeException("Email não pode ser nulo ou vazio");
        }
        if (usuarioDTO.getCentroCusto() == null || usuarioDTO.getCentroCusto().trim().isEmpty()) {
            throw new RuntimeException("Centro de custo não pode ser nulo ou vazio");
        }
    }
}


