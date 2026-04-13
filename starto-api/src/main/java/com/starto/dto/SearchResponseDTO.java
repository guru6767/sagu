package com.starto.dto;

import com.starto.model.Signal;
import com.starto.model.User;
import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class SearchResponseDTO {
    private List<User> profiles;
    private List<Signal> signals;
}
