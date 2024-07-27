package next.school.cesar.projeto_m3.dtos;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioDTO {
    private Long idUsuario;
    private String matricula;
    private String nome;
    private String ultimoNome;
    private Date dtNascimento;
    private String email;
    private String centroCusto;
    private boolean statusUsuario;
    private String statusUsuarioDescricao;

}

