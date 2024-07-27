package next.school.cesar.projeto_m3.dtos;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class EquipeDTO {
    private Long idEquipe;
    private String nome;
    private String descricao;
    private List<String> usuarioMatriculas;
    private List<UsuarioDTO> usuarios;
}
